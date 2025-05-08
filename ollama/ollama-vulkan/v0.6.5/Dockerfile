FROM lcr.loongnix.cn/library/debian:sid AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV CGO_ENABLED=1
ENV LDFLAGS=-s
COPY . .

RUN echo "deb http://mirrors.nju.edu.cn/debian-ports sid main contrib non-free" \
        > /etc/apt/sources.list && \
    apt-get update && \
    apt search glslc && \
    apt-get install \
        -y --no-install-recommends \
        git build-essential libvulkan-dev cmake make libcap-dev \
        libshaderc-dev glslc wget ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM base AS ollama-vulkan
RUN cmake --preset CPU \
    && cmake --build --parallel --preset CPU \
    && cmake --install build --component CPU --strip \
    && cmake --preset Vulkan \
    && cmake --build --parallel --preset Vulkan \
    && cmake --install build --component Vulkan --strip

FROM base AS build
WORKDIR /go/src/github.com/ollama/ollama
COPY . .
RUN wget -O /opt/go1.24.2.linux-loong64.tar.gz \
        https://golang.google.cn/dl/go1.24.2.linux-loong64.tar.gz && \
    tar -zxf /opt/go1.24.2.linux-loong64.tar.gz -C /opt
ENV PATH=/opt/go/bin:$PATH
RUN git clone -b aosc/go1.24.0 --depth=1 \
        https://github.com/AOSC-Tracking/go.git && \
    cd ./go/src && \
    ./make.bash && \
    rm -rf /opt/go
ENV PATH=/go/src/github.com/ollama/ollama/go/bin:$PATH
RUN go env -w GOPROXY='https://goproxy.cn,direct' && \
    go mod download
RUN go build \
        -ldflags "-w -s -X github.com/ollama/ollama/server.mode=release" \
        -p 8 \
        -trimpath \
        -buildmode=pie \
        -o /bin/ollama .

FROM scratch AS archive
COPY --from=ollama-vulkan dist/lib/ollama/vulkan /lib/ollama/vulkan
COPY --from=ollama-vulkan dist/lib/ollama /lib/ollama/
COPY --from=build /bin/ollama /bin/ollama

FROM lcr.loongnix.cn/library/debian:sid
RUN echo "deb http://mirrors.nju.edu.cn/debian-ports sid main contrib non-free" \
        > /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y \
        ca-certificates libcap2 libvulkan1 vulkan-tools libvulkan-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    cp -v /usr/lib/loongarch64-linux-gnu/libcap.so.* /usr/lib/
COPY --from=archive /bin /usr/bin
COPY --from=archive /lib/ollama /usr/lib/ollama
COPY --from=archive /lib/ollama/vulkan/libvulkan.so.1 /usr/lib/

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV OLLAMA_HOST=0.0.0.0:11434
EXPOSE 11434
ENTRYPOINT ["/usr/bin/ollama"]
CMD ["serve"]
