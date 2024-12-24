#!/bin/bash

# Define the range of HAProxy versions
start_version="2.5.0"
end_version="2.9.12"

# Generate all versions between start_version and end_version
versions=()
current_version="$start_version"
while [[ "$current_version" != "$(echo "$end_version" | awk -F. '{print $1"."$2"."($3+1)}')" ]]; do
    versions+=("$current_version")
    current_version="$(echo "$current_version" | awk -F. '{if ($3 < 99) {print $1"."$2"."($3+1)} else {print $1"."($2+1)".0"}}')"
done


# The static content of docker-entrypoint.sh
docker_entrypoint_content='#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
        set -- haproxy "$@"
fi

if [ "$1" = "haproxy" ]; then
        shift # "haproxy"
        # if the user wants "haproxy", let'\''s add a couple useful flags
        #   -W  -- "master-worker mode" (similar to the old "haproxy-systemd-wrapper"; allows for reload via "SIGUSR2")
        #   -db -- disables background mode
        set -- haproxy -W -db "$@"
fi

exec "$@"'

# Directory structure generation
for version in "${versions[@]}"; do
    haproxy_major_version=$(echo $version | cut -d '.' -f 1,2)
    haproxy_url="https://www.haproxy.org/download/$haproxy_major_version/src/haproxy-$version.tar.gz"

    # Check if the version exists
    if ! curl --head --silent --fail "$haproxy_url" > /dev/null; then
        echo "Skipping version $version as it does not exist."
        continue
    fi

    # Skip if the directory already exists
    if [ -d "$version" ]; then
        echo "Skipping version $version as directory already exists."
        continue
    fi

    # Create version directory
    mkdir -p "$version"

    # Generate Dockerfile-alpine
    cat > "$version/Dockerfile-alpine" <<'EOF'
#
# NOTE: THIS DOCKERFILE IS GENERATED VIA "apply-templates.sh"
#
# PLEASE DO NOT EDIT IT DIRECTLY.
#

FROM lcr.loongnix.cn/library/alpine:3.21
ARG HAPROXY_VERSION
ARG HAPROXY_URL
# runtime dependencies
RUN set -eux; \
	apk add --no-cache \
# @system-ca: https://github.com/docker-library/haproxy/pull/216
		ca-certificates \
	;

# roughly, https://git.alpinelinux.org/aports/tree/main/haproxy/haproxy.pre-install?h=3.12-stable
RUN set -eux; \
	addgroup --gid 99 --system haproxy; \
	adduser \
		--disabled-password \
		--home /var/lib/haproxy \
		--ingroup haproxy \
		--no-create-home \
		--system \
		--uid 99 \
		haproxy \
	; \
	mkdir /var/lib/haproxy; \
	chown haproxy:haproxy /var/lib/haproxy


# see https://sources.debian.net/src/haproxy/jessie/debian/rules/ for some helpful navigation of the possible "make" arguments
RUN set -eux; \
	\
	apk add --no-cache --virtual .build-deps \
		gcc \
		libc-dev \
		linux-headers \
		lua5.4-dev \
		make \
		openssl \
		openssl-dev \
		pcre2-dev \
		readline-dev \
		tar \
	; \
	\
	wget -O haproxy.tar.gz "$HAPROXY_URL"; \
	mkdir -p /usr/src/haproxy; \
	tar -xzf haproxy.tar.gz -C /usr/src/haproxy --strip-components=1; \
	rm haproxy.tar.gz; \
	\
	makeOpts=' \
		TARGET=linux-musl \
		USE_GETADDRINFO=1 \
		USE_LUA=1 LUA_INC=/usr/include/lua5.4 LUA_LIB=/usr/lib/lua5.4 \
		USE_OPENSSL=1 \
		USE_PCRE2=1 USE_PCRE2_JIT=1 \
		USE_PROMEX=1 \
		\
		EXTRA_OBJS=" \
		" \
	'; \
	\
	nproc="$(getconf _NPROCESSORS_ONLN)"; \
	eval "make -C /usr/src/haproxy -j '$nproc' all $makeOpts"; \
	eval "make -C /usr/src/haproxy install-bin $makeOpts"; \
	\
	mkdir -p /usr/local/etc/haproxy; \
	cp -R /usr/src/haproxy/examples/errorfiles /usr/local/etc/haproxy/errors; \
	rm -rf /usr/src/haproxy; \
	\
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-network --virtual .haproxy-rundeps $runDeps; \
	apk del --no-network .build-deps; \
	\
# smoke test
	haproxy -v

# https://www.haproxy.org/download/1.8/doc/management.txt
# "4. Stopping and restarting HAProxy"
# "when the SIGTERM signal is sent to the haproxy process, it immediately quits and all established connections are closed"
# "graceful stop is triggered when the SIGUSR1 signal is sent to the haproxy process"
STOPSIGNAL SIGUSR1

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

USER haproxy

# https://github.com/docker-library/haproxy/issues/200
WORKDIR /var/lib/haproxy

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
EOF

    # Generate Dockerfile
    cat > "$version/Dockerfile" <<'EOF'
#
# NOTE: THIS DOCKERFILE IS GENERATED VIA "apply-templates.sh"
#
# PLEASE DO NOT EDIT IT DIRECTLY.
#

FROM lcr.loongnix.cn/library/debian:sid
ARG HAPROXY_VERSION
ARG HAPROXY_URL
# runtime dependencies
RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		ca-certificates \
	; \
	rm -rf /var/lib/apt/lists/*

RUN set -eux; \
	groupadd --gid 99 --system haproxy; \
	useradd \
		--gid haproxy \
		--home-dir /var/lib/haproxy \
		--no-create-home \
		--system \
		--uid 99 \
		haproxy \
	; \
	mkdir /var/lib/haproxy; \
	chown haproxy:haproxy /var/lib/haproxy

RUN set -eux; \
	savedAptMark="$(apt-mark showmanual)"; \
	apt-get update && apt-get install -y --no-install-recommends \
		gcc \
		libc6-dev \
		liblua5.3-dev \
		libpcre2-dev \
		libssl-dev \
		make \
		wget \
	; \
	rm -rf /var/lib/apt/lists/*; \
	wget -O haproxy.tar.gz $HAPROXY_URL; \
	mkdir -p /usr/src/haproxy; \
	tar -xzf haproxy.tar.gz -C /usr/src/haproxy --strip-components=1; \
	rm haproxy.tar.gz; \
	makeOpts=' \
		TARGET=linux-glibc \
		USE_GETADDRINFO=1 \
		USE_LUA=1 LUA_INC=/usr/include/lua5.3 \
		USE_OPENSSL=1 \
		USE_PCRE2=1 USE_PCRE2_JIT=1 \
		USE_PROMEX=1 \
		EXTRA_OBJS=" \
		" \
	'; \
	dpkgArch="$(dpkg --print-architecture)"; \
	case "$dpkgArch" in \
		armel) makeOpts="$makeOpts ADDLIB=-latomic" ;; \
	esac; \
	nproc="$(nproc)"; \
	eval "make -C /usr/src/haproxy -j '$nproc' all $makeOpts"; \
	eval "make -C /usr/src/haproxy install-bin $makeOpts"; \
	mkdir -p /usr/local/etc/haproxy; \
	cp -R /usr/src/haproxy/examples/errorfiles /usr/local/etc/haproxy/errors; \
	rm -rf /usr/src/haproxy; \
	apt-mark auto '.*' > /dev/null; \
	[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark; \
	find /usr/local -type f -executable -exec ldd '{}' ';' \
		| awk '/=>/ { so = $(NF-1); if (index(so, "/usr/local/") == 1) { next }; gsub("^/(usr/)?", "", so); printf "*%s\n", so }' \
		| sort -u \
		| xargs -r dpkg-query --search \
		| cut -d: -f1 \
		| sort -u \
		| xargs -r apt-mark manual \
	; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	haproxy -v

STOPSIGNAL SIGUSR1

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

USER haproxy

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
EOF

    # Generate docker-entrypoint.sh
    echo "$docker_entrypoint_content" > "$version/docker-entrypoint.sh"

    # Make docker-entrypoint.sh executable
    chmod +x "$version/docker-entrypoint.sh"

    # Generate Makefile
    cat > "$version/Makefile" <<EOF
# This file is generated by the template.

REGISTRY?=lcr.loongnix.cn
ORGANIZATION?=library
REPOSITORY?=haproxy
TAG?=${version}

IMAGE=\$(REGISTRY)/\$(ORGANIZATION)/\$(REPOSITORY):\$(TAG)

default: image

image:
	docker build \
		-t \$(IMAGE) \
		-t \$(IMAGE)-sid \
		--build-arg HAPROXY_VERSION=${version} --build-arg HAPROXY_URL=${haproxy_url} .

image-alpine:
	docker build \
                -t \$(IMAGE)-alpine \
                -t \$(IMAGE)-alpine3.21 \
		-f Dockerfile-alpine \
                --build-arg HAPROXY_VERSION=${version} --build-arg HAPROXY_URL=${haproxy_url} .
push:
	docker push \$(IMAGE)
	docker push \$(IMAGE)-sid
	docker push \$(IMAGE)-alpine
	docker push \$(IMAGE)-alpine3.21
EOF

    # Change to version directory
    cd "$version" || continue

    # Run make image and make push
    make image && make image-alpine
    make push

    # Return to the original directory
    cd - || continue

done

echo "Directories and files for HAProxy versions ${versions[*]} have been created, and images pushed."

