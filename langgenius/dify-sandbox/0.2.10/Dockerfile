FROM lcr.loongnix.cn/library/golang:1.23 AS builder
COPY . /app
WORKDIR /app

#add loongarch koffi binary 
RUN wget -O /opt/node-v20.16.0-linux-loong64.tar.xz https://unofficial-builds.nodejs.org/download/release/v20.16.0/node-v20.16.0-linux-loong64.tar.gz \
    && tar -xvf /opt/node-v20.16.0-linux-loong64.tar.xz -C /opt \
    && ln -s /opt/node-v20.16.0-linux-loong64/bin/npm /usr/local/bin/npm \
	&& ln -s /opt/node-v20.16.0-linux-loong64/bin/node /usr/local/bin/node \
    && rm -f /opt/node-v20.16.0-linux-loong64.tar.xz \
	&& /usr/local/bin/npm set registry https://registry.loongnix.cn:5873 \
	&& /usr/local/bin/npm install koffi@2.8.0 --prefix=. \
	&& cp ./node_modules/koffi/indirect.js ./internal/core/runner/nodejs/dependens/node_temp/node_modules/koffi \
	&& cp ./node_modules/koffi/index.js ./internal/core/runner/nodejs/dependens/node_temp/node_modules/koffi \
	&& cp -r ./node_modules/koffi/build/koffi/linux_loong64 ./internal/core/runner/nodejs/dependens/node_temp/node_modules/koffi/build/koffi \
	&& rm -rf ./node_modules \
	&& /usr/local/bin/npm cache clean --force && \
    rm -rf ~/.npm

# if you located in China, you can use aliyun mirror to speed up
# && echo "deb http://mirrors.aliyun.com/debian testing main" > /etc/apt/sources.list
# install dependencies and build binary
RUN echo "deb http://mirrors.aliyun.com/debian-ports sid main contrib non-free" > /etc/apt/sources.list && go env -w GOPROXY='https://goproxy.cn,direct' &&  apt-get update && apt-get       install -y --no-install-recommends pkg-config gcc libseccomp-dev && go mod tidy && bash ./build/build_loong64.sh

FROM lcr.loongnix.cn/library/python:3.10-sid
# if you located in China, you can use aliyun mirror to speed up
# && echo "deb http://mirrors.aliyun.com/debian testing main" > /etc/apt/sources.list
# install system dependencies
RUN echo "deb http://mirrors.aliyun.com/debian-ports sid main contrib non-free" > /etc/apt/sources.list && apt-get update \
    && apt-get install -y --no-install-recommends \
       pkg-config \
       libseccomp-dev \
       wget \
       curl \
       xz-utils \
       zlib1g\
       expat \
       perl\
       libsqlite3-0\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# copy main binary to /main
COPY --from=builder /app/main /app/main
# copy initial env
COPY --from=builder /app/env /app/env

# copy config file
COPY --from=builder /app/conf/config.yaml /app/conf/config.yaml
# copy python dependencies
COPY --from=builder /app/dependencies/python-requirements.txt /app/dependencies/python-requirements.txt

RUN chmod +x /app/main /app/env \
    && pip3 install --no-cache-dir httpx==0.27.2 requests==2.32.3 jinja2==3.0.3 PySocks httpx[socks] \
    && wget -O /opt/node-v20.16.0-linux-loong64.tar.xz https://unofficial-builds.nodejs.org/download/release/v20.16.0/node-v20.16.0-linux-loong64.tar.gz \
    && tar -xvf /opt/node-v20.16.0-linux-loong64.tar.xz -C /opt \
    && ln -s /opt/node-v20.16.0-linux-loong64/bin/node /usr/local/bin/node \
    && rm -f /opt/node-v20.16.0-linux-loong64.tar.xz \
    && /app/env \
    && rm -f /app/env

ENTRYPOINT ["/app/main"]

