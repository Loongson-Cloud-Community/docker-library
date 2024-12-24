FROM lcr.loongnix.cn/kubevirt/centos_base:1.52.0

LABEL maintainer="wangweijie@loongson.cn"

COPY cdi-uploadserver \
     /usr/bin/

COPY install_rpm.sh packages.txt /

RUN ./install_rpm.sh; \
    rm -rf install_rpm.sh packages.txt


ENTRYPOINT ["/usr/bin/cdi-uploadserver","-alsologtostderr"]
