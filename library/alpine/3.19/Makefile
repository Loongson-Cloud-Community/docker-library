# This file is generated by the template.

REGISTRY?=lcr.loongnix.cn
ORGANIZATION?=library
REPOSITORY?=alpine
TAG?=3.19

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)

ROOTFS=rootfs.tar.gz

ALIAS=lcr.loongnix.cn/library/alpine:3.19-temporary

default: image

image: $(ROOTFS)
	docker build \
		--build-arg ROOTFS=$(ROOTFS) \
		-t $(IMAGE) \
		.

push: alias
	docker push $(IMAGE)
	docker push $(ALIAS)

$(ROOTFS):
	wget -O $(ROOTFS) https://dl-cdn.alpinelinux.org/alpine/edge/releases/loongarch64/alpine-minirootfs-20240923-loongarch64.tar.gz

alias:
	docker tag $(IMAGE) $(ALIAS)
