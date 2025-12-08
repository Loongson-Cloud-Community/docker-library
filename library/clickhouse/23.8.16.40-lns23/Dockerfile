FROM lcr.loongnix.cn/loongnix/loongnix-server:23.1

ENV LANG=en_US.UTF-8 \
    TZ=UTC \
    LC_ALL=en_US.UTF-8

ARG CLICKHOUSE_REPO_URL=https://cloud.loongnix.cn/os-packages/clickhouse/loongnix-server/23.1/clickhouse-23.8.16.40-lts/loongarch64/
ARG CLICKHOUSE_VERSION="23.8.16.40"
ARG CLICKHOUSE_PACKAGES="clickhouse-server clickhouse-client clickhouse-common-static"

RUN groupadd -r clickhouse --gid=101 && \
    useradd -r -g clickhouse --uid=101 --home-dir=/var/lib/clickhouse --shell=/bin/bash clickhouse

RUN dnf makecache && \
    dnf install -y --setopt=install_weak_deps=False --nodocs \
        ca-certificates \
        glibc-langpack-en \
        tzdata \
        wget \
        gnupg \
    && dnf clean all && \
    rm -rf /var/cache/dnf

RUN tee /etc/yum.repos.d/clickhouse.repo <<EOF
[clickhouse]
name=ClickHouse Repository
baseurl=${CLICKHOUSE_REPO_URL}
enabled=1
gpgcheck=0
gpgkey=https://packages.clickhouse.com/rpm/pubkey.gpg
EOF

RUN dnf install -y --setopt=install_weak_deps=False --nodocs \
        clickhouse-server \
        clickhouse-client \
        clickhouse-common-static \
    && dnf clean all && rm -rf /var/cache/dnf

RUN mkdir -p /var/lib/clickhouse /var/log/clickhouse-server /etc/clickhouse-server /etc/clickhouse-client && \
    chmod ugo+Xrw -R /var/lib/clickhouse /var/log/clickhouse-server /etc/clickhouse-server /etc/clickhouse-client

RUN clickhouse-local -q 'SELECT 1' >/dev/null

RUN mkdir -p /docker-entrypoint-initdb.d

COPY docker_related_config.xml /etc/clickhouse-server/config.d/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000 8123 9009
VOLUME /var/lib/clickhouse
ENV CLICKHOUSE_CONFIG=/etc/clickhouse-server/config.xml
ENTRYPOINT ["/entrypoint.sh"]
