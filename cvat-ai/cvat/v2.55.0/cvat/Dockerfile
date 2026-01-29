ARG PIP_VERSION=24.0
#ARG BASE_IMAGE=ubuntu:22.04
ARG BASE_IMAGE=lcr.loongnix.cn/library/debian:unstable

FROM ${BASE_IMAGE} AS build-image-base
RUN rm -rf /etc/apt/sources.list.d/debian.sources && echo "deb http://mirrors.ustc.edu.cn/debian unstable main" > /etc/apt/sources.list

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get --no-install-recommends install -yq \
        curl \
        g++ \
        gcc \
        git \
        libgeos-dev \
        libldap2-dev \
        libsasl2-dev \
        make \
        nasm \
        pkg-config \
        libxml2-dev \
        libxmlsec1-dev \
        libxmlsec1-openssl1 \
        libhdf5-dev \
        cargo \
    && rm -rf /var/lib/apt/lists/*
#        python3-pip \
#    && update-alternatives \
#        --install /usr/bin/rustc rustc /usr/bin/rustc-1.85 185 \
#        --slave /usr/bin/cargo cargo /usr/bin/cargo-1.85 \

#build python3.10.13
RUN apt-get update && apt-get install -y --no-install-recommends \
        dpkg-dev \
        gnupg \
        libbluetooth-dev \
        libbz2-dev \
        libc6-dev \
        libdb-dev \
        libexpat1-dev \
        libffi-dev \
        libgdbm-dev \
        liblzma-dev \
        libncursesw5-dev \
        libreadline-dev \
        libsqlite3-dev \
        libssl-dev \
        tk-dev \
        uuid-dev \
        wget \
        xz-utils \
        zlib1g-dev 
RUN wget --no-check-certificate -O python.tar.xz https://cloud.loongnix.cn/releases/loongarch64/python/3.10.16/Python-3.10.16.tar.xz; \
    mkdir -p /usr/src/python; \
    tar --extract --directory /usr/src/python --strip-components=1 --file python.tar.xz; \
    rm python.tar.xz; \
    \
    cd /usr/src/python; \
    gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"; \
    ./configure \
        --build="$gnuArch" \
        --enable-loadable-sqlite-extensions \
        --enable-optimizations \
        --enable-option-checking=fatal \
        --enable-shared \
        --with-lto \
        --with-system-expat \
    ; \
    nproc="$(nproc)"; \
    EXTRA_CFLAGS="$(dpkg-buildflags --get CFLAGS)"; \
    LDFLAGS="$(dpkg-buildflags --get LDFLAGS)"; \
    LDFLAGS="${LDFLAGS:--Wl},--strip-all"; \
    make -j "$nproc" \
        "EXTRA_CFLAGS=${EXTRA_CFLAGS:-}" \
        "LDFLAGS=${LDFLAGS:-}" \
        "PROFILE_TASK=${PROFILE_TASK:-}" \
    ; \
# https://github.com/docker-library/python/issues/784
# prevent accidental usage of a system installed libpython of the same version
    rm python; \
    make -j "$nproc" \
        "EXTRA_CFLAGS=${EXTRA_CFLAGS:-}" \
        "LDFLAGS=${LDFLAGS:--Wl},-rpath='\$\$ORIGIN/../lib'" \
        "PROFILE_TASK=${PROFILE_TASK:-}" \
        python \
    ; \
    make install; \
    \
    ln -s /usr/local/bin/pip3 /usr/local/bin/pip; \
    \
    cd /; \
    rm -rf /usr/src/python; \
    \
    find /usr/local -depth \
        \( \
            \( -type d -a \( -name test -o -name tests -o -name idle_test \) \) \
            -o \( -type f -a \( -name '*.pyc' -o -name '*.pyo' -o -name 'libpython*.a' \) \) \
        \) -exec rm -rf '{}' + \
    ; \
    \
    ldconfig; \
    \
    find /usr/local -type f -executable -not \( -name '*tkinter*' \) -exec ldd '{}' ';' \
        | awk '/=>/ { so = $(NF-1); if (index(so, "/usr/local/") == 1) { next }; gsub("^/(usr/)?", "", so); printf "*%s\n", so }' \
        | sort -u \
        | xargs -r dpkg-query --search \
        | cut -d: -f1 \
        | sort -u \
    ; \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
    rm -rf /var/lib/apt/lists/*; \
    \
    python3 --version 

ARG PIP_VERSION
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
RUN --mount=type=cache,target=/root/.cache/pip/http \
    python3 -m pip install -U pip==${PIP_VERSION} --break-system-packages --ignore-installed

# We build OpenH264, FFmpeg and PyAV in a separate build stage,
# because this way Docker can do it in parallel to all the other packages.
FROM build-image-base AS build-image-av

# Compile Openh264 and FFmpeg
ARG PREFIX=/opt/ffmpeg
ARG PKG_CONFIG_PATH=${PREFIX}/lib/pkgconfig

ENV FFMPEG_VERSION=8.0 \
    OPENH264_VERSION=2.6.0

WORKDIR /tmp/openh264
RUN apt update && apt install -y ca-certificates
RUN curl -sL https://github.com/cisco/openh264/archive/v${OPENH264_VERSION}.tar.gz --output - | \
    tar -zx --strip-components=1 --no-same-owner --no-same-permissions && \
    make -j5 && make install-shared PREFIX=${PREFIX} && make clean

WORKDIR /tmp/ffmpeg
RUN curl -sL https://ffmpeg.org/releases/ffmpeg-${FFMPEG_VERSION}.tar.gz --output - | \
    tar -zx --strip-components=1 --no-same-owner --no-same-permissions && \
    ./configure --disable-nonfree --disable-gpl --enable-libopenh264 \
        --enable-shared --disable-static --disable-doc --disable-programs --prefix="${PREFIX}" && \
    make -j5 && make install && make clean

COPY utils/dataset_manifest/requirements.txt /tmp/utils/dataset_manifest/requirements.txt

# Since we're using pip-compile-multi, each dependency can only be listed in
# one requirements file. In the case of PyAV, that should be
# `dataset_manifest/requirements.txt`. Make sure it's actually there,
# and then remove everything else.
RUN grep -q '^av==' /tmp/utils/dataset_manifest/requirements.txt
RUN sed -i '/^av==/!d' /tmp/utils/dataset_manifest/requirements.txt

RUN --mount=type=cache,target=/root/.cache/pip/http-v2 \
    python3 -m pip wheel --no-binary=av \
    -r /tmp/utils/dataset_manifest/requirements.txt \
    -w /tmp/wheelhouse 

# This stage builds wheels for all dependencies (except PyAV)
FROM build-image-base AS build-image
RUN apt-get update && \
    apt-get --no-install-recommends install -yq \
        ca-certificates

COPY cvat/requirements/ /tmp/cvat/requirements/
COPY utils/dataset_manifest/requirements.txt /tmp/utils/dataset_manifest/requirements.txt

# Exclude av from the requirements file
RUN sed -i '/^av==/d' /tmp/utils/dataset_manifest/requirements.txt

ARG CVAT_CONFIGURATION="production"
RUN pip3 install --upgrade --force-reinstall setuptools pip --break-system-packages \
    -i https://lpypi.loongnix.cn/loongson/pypi --trusted-host lpypi.loongnix.cn  --extra-index-url https://pypi.org/simple --trusted-host pypi.org
RUN apt update && apt install -y libpq-dev \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    meson \
    pkg-config \
    cmake
RUN --mount=type=cache,target=/root/.cache/pip/http-v2 \
    DATUMARO_HEADLESS=1 python3 -m pip wheel --no-deps lxml xmlsec \
    -r /tmp/cvat/requirements/${CVAT_CONFIGURATION}.txt \
    -w /tmp/wheelhouse \
    -i https://lpypi.loongnix.cn/loongson/pypi --trusted-host lpypi.loongnix.cn  --extra-index-url https://pypi.org/simple --trusted-host pypi.org

#FROM golang:1.25.5 AS build-smokescreen
FROM lcr.loongnix.cn/library/golang:1.25.5 AS build-smokescreen

RUN git clone --filter=blob:none --no-checkout https://github.com/stripe/smokescreen.git
RUN cd smokescreen && git checkout eb1ac09 && go build -o /tmp/smokescreen

FROM ${BASE_IMAGE}

ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG socks_proxy
ARG TZ="Etc/UTC"

ENV TERM=xterm \
    http_proxy=${http_proxy}   \
    https_proxy=${https_proxy} \
    no_proxy=${no_proxy} \
    socks_proxy=${socks_proxy} \
    LANG='C.UTF-8'  \
    LC_ALL='C.UTF-8' \
    TZ=${TZ}

ARG USER="django"
ARG CVAT_CONFIGURATION="production"
ENV DJANGO_SETTINGS_MODULE="cvat.settings.${CVAT_CONFIGURATION}"

# Install necessary apt packages
RUN rm -rf /etc/apt/sources.list.d/debian.sources && echo "deb http://mirrors.ustc.edu.cn/debian unstable main" > /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends \
        dpkg-dev \
        gcc \
        gnupg \
        libbluetooth-dev \
        libbz2-dev \
        libc6-dev \
        libdb-dev \
        libexpat1-dev \
        libffi-dev \
        libgdbm-dev \
        liblzma-dev \
        libncursesw5-dev \
        libreadline-dev \
        libsqlite3-dev \
        libssl-dev \
        make \
        tk-dev \
        uuid-dev \
        wget \
        xz-utils \
        zlib1g-dev \
    ; \
    wget --no-check-certificate -O python.tar.xz https://cloud.loongnix.cn/releases/loongarch64/python/3.10.16/Python-3.10.16.tar.xz; \
    mkdir -p /usr/src/python; \
    tar --extract --directory /usr/src/python --strip-components=1 --file python.tar.xz; \
    rm python.tar.xz; \
    \
    cd /usr/src/python; \
    gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"; \
    ./configure \
        --build="$gnuArch" \
        --enable-loadable-sqlite-extensions \
        --enable-optimizations \
        --enable-option-checking=fatal \
        --enable-shared \
        --with-lto \
        --with-system-expat \
    ; \
    nproc="$(nproc)"; \
    EXTRA_CFLAGS="$(dpkg-buildflags --get CFLAGS)"; \
    LDFLAGS="$(dpkg-buildflags --get LDFLAGS)"; \
    LDFLAGS="${LDFLAGS:--Wl},--strip-all"; \
    make -j "$nproc" \
        "EXTRA_CFLAGS=${EXTRA_CFLAGS:-}" \
        "LDFLAGS=${LDFLAGS:-}" \
        "PROFILE_TASK=${PROFILE_TASK:-}" \
    ; \
# https://github.com/docker-library/python/issues/784
# prevent accidental usage of a system installed libpython of the same version
    rm python; \
    make -j "$nproc" \
        "EXTRA_CFLAGS=${EXTRA_CFLAGS:-}" \
        "LDFLAGS=${LDFLAGS:--Wl},-rpath='\$\$ORIGIN/../lib'" \
        "PROFILE_TASK=${PROFILE_TASK:-}" \
        python \
    ; \
    make install; \
    \
    cd /; \
    rm -rf /usr/src/python; \
    \
    find /usr/local -depth \
        \( \
            \( -type d -a \( -name test -o -name tests -o -name idle_test \) \) \
            -o \( -type f -a \( -name '*.pyc' -o -name '*.pyo' -o -name 'libpython*.a' \) \) \
        \) -exec rm -rf '{}' + \
    ; \
    \
    ldconfig; \
    \
    find /usr/local -type f -executable -not \( -name '*tkinter*' \) -exec ldd '{}' ';' \
        | awk '/=>/ { so = $(NF-1); if (index(so, "/usr/local/") == 1) { next }; gsub("^/(usr/)?", "", so); printf "*%s\n", so }' \
        | sort -u \
        | xargs -r dpkg-query --search \
        | cut -d: -f1 \
        | sort -u \
    ; \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
    rm -rf /var/lib/apt/lists/*; \
    ln -s /usr/local/bin/pip3 /usr/local/bin/pip; \
    ln -s /usr/local/bin/python3 /usr/local/bin/python; \
    \
    python3 --version

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get --no-install-recommends install -yq \
        bzip2 \
        ca-certificates \
        curl \
        git \
        libgeos-c1v5 \
        libgl1 \
        libgomp1 \
        libldap2 \
#        libpython3.11 \
        libsasl2-2 \
        libxml2 \
        libxmlsec1-1 \
        libxmlsec1-openssl1 \
        nginx \
        p7zip-full \
        poppler-utils \
        python3 \
        python3-venv \
        supervisor \
        tzdata \
        unrar-free \
        wait-for-it \
    && ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    rm -rf /var/lib/apt/lists/*

# Install smokescreen
COPY --from=build-smokescreen /tmp/smokescreen /usr/local/bin/smokescreen

# Add a non-root user
ENV USER=${USER}
ENV HOME /home/${USER}
RUN adduser --uid=1000 --shell /bin/bash --disabled-password --gecos "" ${USER}

ARG CLAM_AV="no"
RUN if [ "$CLAM_AV" = "yes" ]; then \
        apt-get update && \
        apt-get --no-install-recommends install -yq \
            clamav \
            libclamunrar9 && \
        sed -i 's/ReceiveTimeout 30/ReceiveTimeout 300/g' /etc/clamav/freshclam.conf && \
        freshclam && \
        chown -R ${USER}:${USER} /var/lib/clamav && \
        rm -rf /var/lib/apt/lists/*; \
    fi

# Install wheels from the build image
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:${PATH}"
# Prevent security scanners from finding vulnerabilities in whatever version of setuptools
# is included in Ubuntu by default.
RUN python -m pip uninstall -y setuptools
ARG PIP_VERSION
ARG PIP_DISABLE_PIP_VERSION_CHECK=1

RUN python -m pip install -U pip==${PIP_VERSION}

RUN --mount=type=bind,from=build-image,source=/tmp/wheelhouse,target=/mnt/wheelhouse \
    --mount=type=bind,from=build-image-av,source=/tmp/wheelhouse,target=/mnt/wheelhouse-av \
    pip install -U pip; \
    python -m pip install --no-index /mnt/wheelhouse/*.whl /mnt/wheelhouse-av/*.whl 

ENV NUMPROCS=1
COPY --from=build-image-av /opt/ffmpeg/lib /usr/lib

# These variables are required for supervisord substitutions in files
# This library allows remote python debugging with VS Code
ARG CVAT_DEBUG_ENABLED
RUN if [ "${CVAT_DEBUG_ENABLED}" = 'yes' ]; then \
        python3 -m pip install --no-cache-dir debugpy; \
    fi

# Removing pip due to security reasons. See: https://scout.docker.com/vulnerabilities/id/CVE-2018-20225
# The vulnerability is dubious and we don't use pip at runtime, but some vulnerability scanners mark it as a high vulnerability,
# and it was decided to remove pip from the final image
RUN python -m pip uninstall -y pip

# Install and initialize CVAT, copy all necessary files
COPY cvat/nginx.conf /etc/nginx/nginx.conf
COPY --chown=${USER} supervisord/ ${HOME}/supervisord
COPY --chown=${USER} backend_entrypoint.d/ ${HOME}/backend_entrypoint.d
COPY --chown=${USER} manage.py rqscheduler.py backend_entrypoint.sh wait_for_deps.sh ${HOME}/
COPY --chown=${USER} utils/ ${HOME}/utils
COPY --chown=${USER} cvat/ ${HOME}/cvat
COPY --chown=${USER} components/analytics/clickhouse/init.py ${HOME}/components/analytics/clickhouse/init.py

ARG COVERAGE_PROCESS_START
RUN if [ "${COVERAGE_PROCESS_START}" ]; then \
        echo "import coverage; coverage.process_startup()" > /opt/venv/lib/python3.10/site-packages/coverage_subprocess.pth; \
    fi

# RUN all commands below as 'django' user.
# Use numeric UID/GID so that the image is compatible with the Kubernetes runAsNonRoot setting.
USER 1000:1000
WORKDIR ${HOME}

RUN mkdir -p data share keys logs /tmp/supervisord static

EXPOSE 8080
ENTRYPOINT ["./backend_entrypoint.sh"]
