#syntax=docker/dockerfile-upstream:1.19
FROM lcr.loongnix.cn/library/golang:1.25-alpine AS builder

LABEL maintainer="Derek Collison <derek@nats.io>"
LABEL maintainer="Waldemar Quevedo <wally@nats.io>"

ARG TARGETARCH loong64

ENV VERSION_NATS=0.3.0
ENV VERSION_NATS_TOP=0.6.3
ENV VERSION_NSC=2.12.0
ENV VERSION_NKEYS=0.4.11

ENV GOPATH=/go/${TARGETARCH}

ENV GOPROXY="https://goproxy.cn"
RUN \
    set -e; \
    mkdir -p ${GOPATH}; \
    \
    go install -ldflags="-X main.version=${VERSION_NSC}" github.com/nats-io/nsc/v2@v${VERSION_NSC}; \
    go install -ldflags="-X main.version=${VERSION_NATS_TOP}" github.com/nats-io/nats-top@v${VERSION_NATS_TOP}; \
    go install -ldflags="-X main.version=${VERSION_NATS}" github.com/nats-io/natscli/nats@v${VERSION_NATS}; \
    go install -ldflags="-X main.version=${VERSION_NKEYS}" github.com/nats-io/nkeys/nk@v${VERSION_NKEYS}

FROM lcr.loongnix.cn/library/alpine:3.22

COPY --from=builder /go/bin/ /usr/local/bin

RUN \
    set -e; \
    apk -U upgrade; \
    apk add --no-cache ca-certificates curl figlet jq; \
    rm -rf /var/cache/apk && mkdir /var/cache/apk; \
    \
    addgroup -g 1000 nats; \
    adduser -D -u 1000 -G nats nats; \
    \
    mkdir -p /nsc; \
    chown nats:root /nsc /home/nats; \
    chmod 0775 /nsc /home/nats

ENV NKEYS_PATH=/nsc/nkeys
ENV XDG_DATA_HOME=/nsc
ENV XDG_CONFIG_HOME=/nsc/.config

COPY entrypoint.sh /entrypoint.sh

COPY profile.sh /etc/profile.d

RUN chmod +x /entrypoint.sh

WORKDIR /root

ENTRYPOINT ["/entrypoint.sh"]
