FROM lcr.loongnix.cn/library/buildpack-deps:sid-curl

LABEL maintainer="wangweijie@loongson.cn"

RUN apt-get update && apt-get install -y --no-install-recommends \
		git \
		mercurial \
		openssh-client \
		subversion \
		\
		procps \
	&& rm -rf /tmp/* /var/cache/apt/* /var/lib/apt/lists/*
