src: clean
	git clone --depth 1 -b loong64-0.15.2 https://github.com/Loongson-Cloud-Community/metallb
image: src
	cd metallb && docker build --build-arg https_proxy=${https_proxy}  -t lcr.loongnix.cn/metallb/speaker:0.15.2  -f speaker/Dockerfile .

push:
	docker push lcr.loongnix.cn/metallb/speaker:0.15.2

clean:
	rm -rf  metallb
