src: clean
	git clone --depth 1 -b loongarch64-2.5.6 https://github.com/Loongson-Cloud-Community/attu src

image: src
	cd src && docker build -t lcr.loongnix.cn/library/attu:2.5.6 -f Dockerfile .
push:
	docker push lcr.loongnix.cn/library/attu:2.5.6
clean:
	rm -rf src
