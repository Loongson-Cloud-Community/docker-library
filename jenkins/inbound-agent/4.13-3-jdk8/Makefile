default: image

image:
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t lcr.loongnix.cn/jenkins/inbound-agent:4.13-3-jdk8 \
		.

push:
	docker push lcr.loongnix.cn/jenkins/inbound-agent:4.13-3-jdk8
