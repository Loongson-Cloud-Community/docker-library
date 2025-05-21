FROM lcr.loongnix.cn/library/debian:sid

# install cgo-related dependencies
RUN set -eux; \
        apt-get update; \
        apt-get install -y --no-install-recommends \
                g++ \
                gcc \
                libc6-dev \
                make \
                wget \
                pkg-config \
		ca-certificates \
        ; \
        apt-get autoclean all; \
        rm -rf /var/lib/apt/lists/*

ENV PATH /usr/local/go/bin:$PATH

ENV GOLANG_VERSION 1.23.9

RUN set -eux; \
	url='https://go.dev/dl/go1.23.9.linux-loong64.tar.gz'; \
	sha256='50b08d8b3a7fb027608db01ff63152001b33710b2ec9acad995adbb63bd8a02a'; \
	wget -O go.tgz "$url" --progress=dot:giga; \
	echo "$sha256 *go.tgz" | sha256sum -c -; \
	tar -C /usr/local -xzf go.tgz; \
	rm go.tgz; \
	go version

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH
