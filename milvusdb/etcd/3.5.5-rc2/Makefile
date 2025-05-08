src: clean
	git clone --depth 1 -b loongarch64-3.5.5-r3 https://github.com/Loongson-Cloud-Community/bitnami-docker-etcd src
image: src
	cd src/3.5/debian-11 && docker build -t lcr.loongnix.cn/milvusdb/etcd:3.5.5-r3 -f Dockerfile .

push:
	docker push lcr.loongnix.cn/milvusdb/etcd:3.5.5-r3

clean:
	rm -rf src
