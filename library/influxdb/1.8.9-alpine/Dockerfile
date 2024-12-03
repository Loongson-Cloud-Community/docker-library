FROM lcr.loongnix.cn/library/alpine:3.19

RUN echo 'hosts: files dns' >> /etc/nsswitch.conf
RUN apk add --no-cache tzdata bash ca-certificates && \
    update-ca-certificates

ENV INFLUXDB_VERSION 1.8.9

RUN wget --no-verbose http://cloud.loongnix.cn/releases/loongarch64/influxdata/influxdb/1.8.9/influxdb-1.8.9-static_linux_loong64.tar.gz
#COPY influxdb-${INFLUXDB_VERSION}-static_linux_loong64.tar.gz influxdb-${INFLUXDB_VERSION}-static_linux_loong64.tar.gz

RUN set -ex && \
    apk add --no-cache --virtual .build-deps wget gnupg tar && \
    mkdir -p /usr/src && \
    tar -C /usr/src -xzf influxdb-${INFLUXDB_VERSION}-static_linux_loong64.tar.gz && \
    chmod +x /usr/src/influxdb-*/influx \
             /usr/src/influxdb-*/influx_inspect \
             /usr/src/influxdb-*/influx_stress \
             /usr/src/influxdb-*/influxd &&\
    mv /usr/src/influxdb-*/influx \
       /usr/src/influxdb-*/influx_inspect \
       /usr/src/influxdb-*/influx_stress  \
       /usr/src/influxdb-*/influxd \
       /usr/bin/ &&\
    rm -rf *.tar.gz* /usr/src /root/.gnupg && \
    apk del .build-deps
COPY influxdb.conf /etc/influxdb/influxdb.conf

EXPOSE 8086

VOLUME /var/lib/influxdb

COPY entrypoint.sh /entrypoint.sh
COPY init-influxdb.sh /init-influxdb.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["influxd"]
