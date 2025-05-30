FROM lcr.loongnix.cn/library/alpine:3.21

RUN apk --no-cache upgrade
RUN apk add --no-cache ca-certificates wget

ENV PATH /usr/local/go/bin:$PATH
ENV GOLANG_VERSION 1.21.13

RUN set -eux; \
	url='http://ftp.loongnix.cn/toolchain/golang/go-1.21/abi2.0/go1.21.13.linux-loong64.tar.gz'; \
	sha256='c08348d8f5c8a0265147195c9469e79f6f02bf568c3d8a3c908ddd5168d28945'; \
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
