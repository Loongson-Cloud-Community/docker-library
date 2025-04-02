VERSION=8.7.0
PROJECT=kibana
image=lcr.loongnix.cn/library/kibana:$(VERSION)
NODE_VERSION=20.8.0
url=https://artifacts.elastic.co/downloads/kibana/kibana-8.7.0-linux-x86_64.tar.gz
node_url=https://unofficial-builds.nodejs.org/download/release/v$(NODE_VERSION)/node-v$(NODE_VERSION)-linux-loong64.tar.gz
docker_url=https://github.com/elastic/dockerfiles
src: clean
	wget $(url) && tar xf $(PROJECT)-$(VERSION)-linux-x86_64.tar.gz
	cp new_node_version_validator.js $(PROJECT)-$(VERSION)/src/setup_node_env/node_version_validator.js 
	cp re2.node $(PROJECT)-$(VERSION)/node_modules/re2/build/Release/re2.node
	wget $(node_url) && tar xf node-v$(NODE_VERSION)-linux-loong64.tar.gz
	rm -rf $(PROJECT)-$(VERSION)/node && mv node-v$(NODE_VERSION)-linux-loong64 $(PROJECT)-$(VERSION)/node 

image: src
	docker build \
	--build-arg https_proxy=$(https_proxy) \
	-t $(image) .
#	git clone --depth 1 -b v8.7.0 $(docker_url)
	
push:
	docker push $(image)

clean:
	rm -rf node* kibana*
