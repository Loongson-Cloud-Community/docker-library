default: image

image:
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t lcr.loongnix.cn/library/redis:7.2.7 \
		-t lcr.loongnix.cn/library/redis:7.2.7-trixie \
		.

push:
	docker push lcr.loongnix.cn/library/redis:7.2.7
	docker push lcr.loongnix.cn/library/redis:7.2.7-trixie
