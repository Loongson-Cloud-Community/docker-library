# This file is generated by the template.

REGISTRY	?=lcr.loongnix.cn
ORGANIZATION	?=library
REPOSITORY	?=buildkit
TAG		?=0.12.3
LATEST		?=true

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)
LATEST_IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):latest
GIT_URL=https://github.com/Loongson-Cloud-Community/buildkit.git

default: image

src:
	git clone -b loong64-0.12.3 $(GIT_URL) $@

image: src
	cd src/ && docker buildx build --load -t lcr.loongnix.cn/library/dockerfile:master -f ./frontend/dockerfile/cmd/dockerfile-frontend/Dockerfile .
push: src
	docker push lcr.loongnix.cn/library/dockerfile:master
clean:
	rm -rf src
