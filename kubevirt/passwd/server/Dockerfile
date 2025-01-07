FROM lcr.loongnix.cn/kubevirt/centos_base:1.52.0

LABEL maintainer="wangweijie@loongson.cn"

RUN groupadd nonroot-user -g 1001 &&\
	useradd nonroot-user -u 1001 -g 1001 &&\
	usermod -s /bin/bash nonroot-user

USER 1001

CMD ["/bin/bash"]
