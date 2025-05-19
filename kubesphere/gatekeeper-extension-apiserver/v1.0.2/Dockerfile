FROM lcr.loongnix.cn/library/golang:1.23 as build_context
LABEL maintainer="doupengda@loongson.cn"
COPY / /workspace
WORKDIR /workspace

# Copy the Go Modules manifests
#COPY go.mod go.mod
#COPY go.sum go.sum
# cache deps before building and copying source so that we don't need to re-download as much
# and so that source changes don't invalidate our downloaded layer
RUN set -x \
	&& go env -w GOSUMDB=off \
        && go env -w GOPROXY="https://goproxy.cn" \
	&& go mod download 

# Copy the go source
#COPY main.go main.go
#COPY query query/


RUN CGO_ENABLED=0 go build -o bin/apiserver .

FROM scratch

COPY --from=build_context /workspace/bin/apiserver /usr/local/bin/apiserver

WORKDIR /app

CMD ["apiserver"]
