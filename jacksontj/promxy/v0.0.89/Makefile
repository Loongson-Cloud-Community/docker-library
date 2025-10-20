REGISTRY        ?=lcr.loongnix.cn
ORGANIZATION    ?=jacksontj
REPOSITORY      ?=promxy
TAG             ?=v0.0.89
LATEST          ?=false

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)
LATEST_IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):latest

default: image

image: source build

source: clear
	wget https://github.com/jacksontj/promxy/archive/refs/tags/v0.0.89.tar.gz
	tar -xzf v0.0.89.tar.gz
	mv promxy-0.0.89 promxy
	rm -f v0.0.89.tar.gz


build: 
	docker build \
		--build-arg http_proxy=$(http_proxy) \
                --build-arg https_proxy=$(https_proxy) \
                -t $(IMAGE) \
                .

push:
	docker push $(IMAGE)
	#latest image
	@if [ $(LATEST) = "true" ]; \
                then \
                docker tag $(IMAGE) $(LATEST_IMAGE); \
                docker push $(LATEST_IMAGE); \
        fi

clear:
	rm -rf promxy
