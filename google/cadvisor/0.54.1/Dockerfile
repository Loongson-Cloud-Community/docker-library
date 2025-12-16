ARG BASE_IMG=mirror.gcr.io/library/alpine:3.18
ARG GO_IMG=registry.hub.docker.com/library/golang:1.22-alpine3.18
FROM ${GO_IMG} AS build

WORKDIR /go/src/github.com/google/cadvisor

ENV GOPROXY=https://goproxy.cn,https://mirrors.aliyun.com/goproxy/,https://goproxy.io,direct

# Cache Golang Dependencies for faster incremental builds
ADD go.mod go.sum ./
RUN go mod download
ADD cmd/go.mod cmd/go.sum ./cmd/
RUN cd cmd && go mod download

ADD . .

ARG VERSION

# libipmctl only works on x86_64 CPUs.
RUN export GO_TAGS="libpfm,netgo"; \
    if [ "$(uname --machine)" = "x86_64" ]; then \
          # Disable libipmctl due to https://github.com/google/cadvisor/issues/3482
          #export GO_TAGS="$GO_TAGS,libipmctl"; \
          export GO_TAGS="$GO_TAGS"; \
    fi; \
    GO_CGO_ENABLED=0 GOARCH=loong64 GO_FLAGS="-tags=$GO_TAGS" VERSION=${VERSION} ./build/build.sh

FROM ${BASE_IMG}

RUN apk --no-cache add wget && \
    echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf && \
    rm -rf /var/cache/apk/*


COPY --from=build /go/src/github.com/google/cadvisor/_output/cadvisor /usr/bin/cadvisor

EXPOSE 8080

ENV CADVISOR_HEALTHCHECK_URL=http://localhost:8080/healthz

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider $CADVISOR_HEALTHCHECK_URL || exit 1

ENTRYPOINT ["/usr/bin/cadvisor", "-logtostderr"]
