# This file is generated by the template.

REGISTRY?=lcr.loongnix.cn
ORGANIZATION?=library
REPOSITORY?=php
TAG?=7.4.30-fpm-alpine

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)


default: image

image:
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t $(IMAGE) \
		.

push:
	docker push $(IMAGE)
