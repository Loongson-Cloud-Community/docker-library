FROM lcr.loongnix.cn/library/golang:1.23-alpine3.21 AS builder

ARG GO_LDFLAGS

COPY . /go/src/github.com/kubeedge/

RUN apk update && \
    apk add curl

ENV GOPROXY=https://goproxy.cn

#/go/src/github.com/kubeedge/kubeedge/cloud/cmd/iptablesmanager
RUN curl -SsLO https://github.com/kubeedge/kubeedge/archive/refs/tags/v1.13.1.tar.gz \
    && tar -xzf v1.13.1.tar.gz \
    && mv kubeedge-1.13.1/ kubeedge \
    && mv kubeedge /go/src/github.com/kubeedge/ \
    && rm -rf v1.13.1.tar.gz 



RUN CGO_ENABLED=0 GO111MODULE=off go build -v -o /usr/local/bin/iptables-manager -ldflags "$GO_LDFLAGS -w -s" \
    github.com/kubeedge/kubeedge/cloud/cmd/iptablesmanager


FROM alpine:3.21.0

COPY --from=builder /usr/local/bin/iptables-manager /usr/local/bin/iptables-manager

RUN apk add --update-cache \
    iptables \
    && rm -rf /var/cache/apk/*

ENTRYPOINT ["iptables-manager"]
