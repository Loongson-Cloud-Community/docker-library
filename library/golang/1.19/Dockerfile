FROM lcr.loongnix.cn/library/buildpack-deps:scm

# install cgo-related dependencies
RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		g++ \
		gcc \
		libc6-dev \
		make \
		pkg-config \
	; \
	apt-get autoclean all; \
	rm -rf /var/lib/apt/lists/*

ENV PATH /usr/local/go/bin:$PATH

ENV GOLANG_VERSION 1.19.11

RUN set -eux; \
	url='http://ftp.loongnix.cn/toolchain/golang/go-1.19/abi2.0/go1.19.11.linux-loong64.tar.gz'; \
	sha256='a2621ea9e658ac4cfc01e7bb3185d210b09a674fed7031f080e01ec06985b4e5'; \
	wget -O go.tgz "$url" --progress=dot:giga; \
	echo "$sha256 *go.tgz" | sha256sum -c -; \
	tar -C /usr/local -xzf go.tgz; \
	rm go.tgz; \
	go version

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH
