FROM lcr.loongnix.cn/library/alpine:3.19

RUN apk --no-cache upgrade
RUN apk add --no-cache ca-certificates wget

ENV PATH /usr/local/go/bin:$PATH
ENV GOLANG_VERSION 1.22.9

RUN set -eux; \
	url='http://ftp.loongnix.cn/toolchain/golang/go-1.22/abi2.0/go1.22.9.linux-loong64.tar.gz'; \
	sha256='95e1c80d2340e20f9c786b8a8a791facc7c99e82d7e4823b61e6f90d96e1cf78'; \
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
