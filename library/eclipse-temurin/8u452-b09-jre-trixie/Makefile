default: image

image:
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t lcr.loongnix.cn/library/eclipse-temurin:8-jre \
		-t lcr.loongnix.cn/library/eclipse-temurin:8u452-b09-jre-trixie \
		.

push:
	docker push lcr.loongnix.cn/library/eclipse-temurin:8u452-b09-jre-trixie
	docker push lcr.loongnix.cn/library/eclipse-temurin:8-jre
