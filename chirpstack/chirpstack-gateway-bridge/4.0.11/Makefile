src: clean
	git clone --depth 1 -b v4.0.11 https://github.com/Loongson-Cloud-Community/chirpstack-gateway-bridge src

image: src
	cd src && docker build --build-arg https_proxy=$(https_proxy) -t lcr.loongnix.cn/chirpstack/chirpstack-gateway-bridge/4.0.11 -f Dockerfile .
push:
	docker push lcr.loongnix.cn/chirpstack/chirpstack-gateway-bridge/4.0.11

clean:
	rm -rf src
