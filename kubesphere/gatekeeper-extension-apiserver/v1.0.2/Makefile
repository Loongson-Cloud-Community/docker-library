  
REGISTRY        ?=lcr.loongnix.cn
ORGANIZATION    ?=kubesphere
REPOSITORY      ?=gatekeeper-extension-apiserver
TAG             ?=v1.0.2

IMAGE=$(REGISTRY)/$(ORGANIZATION)/$(REPOSITORY):$(TAG)

default: image

#pkg:
#	wget https://github.com/kubesphere-extensions/gatekeeper/archive/refs/tags/v1.0.2.tar.gz 
#	tar -xzf v1.0.2.tar.gz
#	mv gatekeeper-1.0.2/modules/api/go.mod \
#		gatekeeper-1.0.2/modules/api/go.sum \
#		gatekeeper-1.0.2/modules/api/main.go \
#		.
#	mv gatekeeper-1.0.2/modules/api/query/field.go \
#		gatekeeper-1.0.2/modules/api/query/lister.go \
#		gatekeeper-1.0.2/modules/api/query/types.go \
#		query/
#	rm -rf gatekeeper-1.0.2
#	rm -rf v1.0.2.tar.gz
#
#download: pkg

image: 
	docker build \
                --build-arg http_proxy=$(http_proxy) \
                --build-arg https_proxy=$(https_proxy) \
                -t $(IMAGE) \
                .

push:
       docker push $(IMAGE)


