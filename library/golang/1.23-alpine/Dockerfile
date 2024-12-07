FROM lcr.loongnix.cn/library/alpine:3.19

RUN apk --no-cache upgrade
RUN apk add --no-cache ca-certificates wget

ENV PATH /usr/local/go/bin:$PATH
ENV GOLANG_VERSION 1.23.3

RUN set -eux; \
	url='https://go.dev/dl/go1.23.3.linux-loong64.tar.gz'; \
	sha256='1d0161a8946c7d99f717bad23631738408511f9f87e78d852224a023d8882ad8'; \
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
