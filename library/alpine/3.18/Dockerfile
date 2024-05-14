FROM scratch

MAINTAINER wangweijie@loongson.cn

ADD rootfs.tar.gz /

RUN sed -i "s/http/\#http/g" etc/apk/repositories &&\
    echo "https://dev.alpinelinux.org/~loongarch/v3.18/community" >> etc/apk/repositories &&\
    echo "https://dev.alpinelinux.org/~loongarch/v3.18/main" >> etc/apk/repositories

CMD ["sh"]
