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

ENV GOLANG_VERSION 1.24.3

RUN set -eux; \
	url='https://go.dev/dl/go1.24.3.linux-loong64.tar.gz'; \
	sha256='e4b003c04c902edc140153d279b42167f1ad7c229f48f1f729bbef5e65e88d1f'; \
	wget -O go.tgz "$url" --progress=dot:giga; \
	echo "$sha256 *go.tgz" | sha256sum -c -; \
	tar -C /usr/local -xzf go.tgz; \
	rm go.tgz; \
	go version

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH
