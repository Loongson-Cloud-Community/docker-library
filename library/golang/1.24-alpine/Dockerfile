FROM lcr.loongnix.cn/library/alpine:3.21

RUN apk --no-cache upgrade
RUN apk add --no-cache ca-certificates wget

ENV PATH /usr/local/go/bin:$PATH
ENV GOLANG_VERSION 1.24.3

RUN set -eux; \
	url='https://go.dev/dl/go1.24.3.linux-loong64.tar.gz'; \
	sha256='e4b003c04c902edc140153d279b42167f1ad7c229f48f1f729bbef5e65e88d1f'; \
	wget -O go.tgz "$url" --progress=dot:giga; \
	echo "$sha256 *go.tgz" | sha256sum -c -; \
	tar -C /usr/local -xzf go.tgz; \
	rm go.tgz; \
	go version

RUN apk del wget

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH
