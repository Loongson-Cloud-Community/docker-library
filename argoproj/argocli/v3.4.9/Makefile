# This file is generated by the template.

REGISTRY	?=lcr.loongnix.cn
ORGANIZATION	?=argoproj
REPOSITORY	?=argocli
TAG		?=v3.4.9
LATEST		?=true

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)
LATEST_IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):latest
SOURCE_URL=https://github.com/argoproj/argo-workflows.git
SOURCE=$(shell echo $(SOURCE_URL) | awk -F '/' '{print $$NF}' | awk -F '.' '{print $$1}')
PATCH=0001-port-to-loong64.patch

default: image

image: src/$(SOURCE)
	make -C $< $(REPOSITORY)-image

src/$(SOURCE):
	git clone -b $(TAG) --depth 1 $(SOURCE_URL) $@
	cd $@ && \
		git apply ../../$(PATCH)

push:
	docker push $(IMAGE)
	#latest image
	@if [ $(LATEST) = "true" ]; \
		then \
		docker tag $(IMAGE) $(LATEST_IMAGE); \
		docker push $(LATEST_IMAGE); \
	fi

clean:
	rm -rf src
