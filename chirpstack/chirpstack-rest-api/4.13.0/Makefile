src: clean
	git clone --depth 1 -b loong64-4.13.0 https://github.com/Loongson-Cloud-Community/chirpstack-rest-api src
image: src
	cd src && docker build --build-arg https_proxy=$(https_proxy) -t lcr.loongnix.cn/chirpstack/chirpstack-rest-api:4.13.0  .
push:
	docker push lcr.loongnix.cn/chirpstack/chirpstack-rest-api:4.13.0
clean:
	rm -rf src
