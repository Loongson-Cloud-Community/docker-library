# stage 1 building the code
FROM lcr.loongnix.cn/library/golang:1.23-buster as builder

ARG VERSION="v1.51.2"
ARG SHORT_COMMIT="3e8facb4949586ba9e5dccdd2f9f0fe727a5e335"
ARG DATE="2023-2-20"

COPY / /golangci
WORKDIR /golangci
ENV GOPROXY https://goproxy.cn

RUN CGO_ENABLED=0 go build -trimpath -ldflags "-s -w -X main.version=$VERSION -X main.commit=$SHORT_COMMIT -X main.date=$DATE" -o golangci-lint ./cmd/golangci-lint/main.go

# stage 2
FROM golang:1.23-buster
# related to https://github.com/golangci/golangci-lint/issues/3107
ENV GOROOT /usr/local/go
# don't place it into $GOPATH/bin because Drone mounts $GOPATH as volume
COPY --from=builder /golangci/golangci-lint /usr/bin/
CMD ["golangci-lint"]
