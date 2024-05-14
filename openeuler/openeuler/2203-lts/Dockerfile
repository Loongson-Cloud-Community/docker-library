FROM scratch
LABEL maintainer="yangzewei@loongson.cn"
ARG TARGETARCH
ARG TAG
ADD openEuler-$TAG.rootfs.$TARGETARCH.tar.gz /
# See more in https://gitee.com/openeuler/cloudnative/issues/I482Q6
RUN ln -sf /usr/share/zoneinfo/UTC /etc/localtime && \
    sed -i "s/TMOUT=300/TMOUT=0/g" /etc/bashrc && \
    awk 'NR==42 || NR==60 {sub(/1/, "0");} 1' etc/yum.repos.d/openEuler.repo > tempab && \
    mv tempab /etc/yum.repos.d/openEuler.repo && \
    yum -y update && yum clean all && yum install -y --releasever=2203-LTS openEuler-release
CMD ["bash"]
