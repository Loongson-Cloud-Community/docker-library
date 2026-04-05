REGISTRY        ?=lcr.loongnix.cn
ORGANIZATION    ?=openeuler
REPOSITORY      ?=openeuler
TAG             ?=22.03-LTS
LATEST          ?=true
ARCH?=loongarch64

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)
IMAGE_EULERMAKER=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):22.03-lts-loongarch

default: image

rootfs:
	bash mkimage-rootfs.sh
	#wget https://github.com/Loongson-Cloud-Community/openeuler-docker-images/releases/download/22.03-LTS/openEuler-22.03-LTS.rootfs.loongarch64.tar.gz
image: rootfs
	docker build  \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t $(IMAGE) \
		.
	docker build \
		--build-arg http_proxy=$(http_proxy) \
		--build-arg https_proxy=$(https_proxy) \
		-t $(IMAGE_EULERMAKER) \
		-f Dockerfile-eulermaker \
		.
	rm -rf openEuler-22.03-LTS.rootfs.loongarch64.tar.gz  openEuler-22.03-LTS.rootfs.loongarch64.tar.gz.md5

push:
	docker push $(IMAGE)
