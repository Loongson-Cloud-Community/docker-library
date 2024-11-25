FROM lcr.loongnix.cn/library/alpine:3.19

LABEL maintainer="wangweijie@loongson.cn"

ADD etcd-v3.5.4-linux-loong64/etcd /usr/local/bin/
ADD etcd-v3.5.4-linux-loong64/etcdctl /usr/local/bin/
RUN mkdir -p /var/etcd/ \
    mkdir -p /var/lib/etcd/

RUN echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf

EXPOSE 2379 2380

CMD ["/usr/local/bin/etcd"]
