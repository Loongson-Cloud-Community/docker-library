src:
	git clone --depth 1 -b loongarch-2.4.12 https://github.com/Loongson-Cloud-Community/milvus
	wget http://cloud.loongnix.cn/releases/loongarch64/milvus-io/milvus/2.4.12/milvus-2.4.12-linux-loong64.tar.gz

image: src
	cd milvus && tar xf ../milvus-2.4.12-linux-loong64.tar.gz && bash build/build_image.sh

push:
	docker push lcr.loongnix.cn/milvusdb/milvus:2.4.12

clean:
	rm -rf milvus*
