FROM lcr.loongnix.cn/library/alpine:3.21 AS alpine

ADD redis_exporter-v1.20.0.linux-loong64.tar.gz /
RUN apk update && apk add ca-certificates \
    && mv /redis_exporter-v1.20.0.linux-loong64/redis_exporter /redis_exporter \
    && rm -rf /redis_exporter-v1.20.0.linux-loong64

# Run as non-root user for secure environments
USER 59000:59000

EXPOSE     9121
ENTRYPOINT [ "/redis_exporter" ]
