# This file is generated by the template.

REGISTRY	?=lcr.loongnix.cn
ORGANIZATION	?=bitnami
REPOSITORY	?=metrics-server
TAG		?=0.6.1
LATEST		?=true

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)
LATEST_IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):latest

default: image

src:
	git clone -b v0.6.1 --depth 1 https://github.com/kubernetes-sigs/metrics-server src && \
	cd src && git apply ../0001-add-loong64-support.patch

image: src
	cd src && make metrics-server && make container

push:
	docker push $(IMAGE)
	#latest image
	@if [ $(LATEST) = "true" ]; \
		then \
		docker tag $(IMAGE) $(LATEST_IMAGE); \
		docker push $(LATEST_IMAGE); \
	fi
