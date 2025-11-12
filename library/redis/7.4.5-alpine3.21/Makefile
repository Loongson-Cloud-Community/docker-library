default: image

image:
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t lcr.loongnix.cn/library/redis:7.4.5-alpine \
		-t lcr.loongnix.cn/library/redis:7.4.5-alpine3.21 \
		.
	echo 'test 1112'

push:
	docker push lcr.loongnix.cn/library/redis:7.4.5-alpine
	docker push lcr.loongnix.cn/library/redis:7.4.5-alpine3.21
