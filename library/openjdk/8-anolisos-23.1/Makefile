# This file is generated by the template.

REGISTRY?=lcr.loongnix.cn
ORGANIZATION?=library
REPOSITORY?=openjdk

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY)

default: image

image:
	docker build \
		 -t $(IMAGE):8-anolisos-23.1 \
		 -t $(IMAGE):8u432_b06-anolisos-23.1 \
		.

push:
	docker push $(IMAGE):8-anolisos-23.1 
	docker push $(IMAGE):8u432_b06-anolisos-23.1