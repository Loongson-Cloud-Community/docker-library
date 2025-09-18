FROM lcr.loongnix.cn/library/alpine:3.21 AS alpine

ADD redis_exporter /
RUN apk update && apk add ca-certificates 

# Run as non-root user for secure environments
USER 59000:59000

EXPOSE     9121
ENTRYPOINT [ "/redis_exporter" ]
