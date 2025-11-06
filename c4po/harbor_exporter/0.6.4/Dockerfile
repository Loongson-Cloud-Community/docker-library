FROM buildpack-deps:scm As source

ARG VERSION 0.6.4
ENV VERSION=${VERSION}

WORKDIR /wk

RUN git clone \
    -b v${VERSION} \
    --depth=1 \
    https://github.com/c4po/harbor_exporter.git

FROM golang:1.24-alpine AS builder

ENV GO111MODULE=on \
  GOPROXY=https://goproxy.cn \
  CGO_ENABLED=0 \
  GOOS=linux \
  GOARCH=loong64

RUN apk add make git
COPY --from=source /wk/harbor_exporter /src
WORKDIR /src

RUN go get -u golang.org/x/sys; \
    go get -u github.com/prometheus/procfs; \
    go mod tidy

RUN make build

FROM alpine:latest
RUN apk --no-cache add ca-certificates

RUN addgroup -g 1001 appgroup && \
  adduser -H -D -s /bin/false -G appgroup -u 1001 appuser

USER 1001:1001
COPY --from=builder /src/releases/harbor_exporter /bin/harbor_exporter
ENTRYPOINT ["/bin/harbor_exporter"]
