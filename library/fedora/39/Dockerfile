From scratch
MAINTAINER zhangwenlong@loongson.cn
ADD fedora-39.rootfs.loongarch64.tar.gz /
RUN sed -i 's/enabled=1/enabled=0/g' /etc/yum.repos.d/fedora.repo
ADD fedora-rawhide.repo /etc/yum.repos.d
CMD ["/bin/bash"]
