default: image

image:
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t lcr.loongnix.cn/library/eclipse-temurin:21-jdk \
		-t lcr.loongnix.cn/library/eclipse-temurin:21.0.7_6-jdk-trixie \
		.

push:
	docker push lcr.loongnix.cn/library/eclipse-temurin:21.0.7_6-jdk-trixie
	docker push lcr.loongnix.cn/library/eclipse-temurin:21-jdk
