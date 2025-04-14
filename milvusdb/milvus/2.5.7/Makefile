src:
	git clone --depth 1 -b loongarch-2.5.7 https://github.com/Loongson-Cloud-Community/milvus
	wget http://cloud.loongnix.cn/releases/loongarch64/milvus-io/milvus/2.5.7/milvus-2.5.7-linux-loong64.tar.gz

image: src
	cd milvus && tar xf ../milvus-2.5.7-linux-loong64.tar.gz && bash build/build_image.sh

push:
	docker push lcr.loongnix.cn/milvusdb/milvus:2.5.7

clean:
	rm -rf milvus*
