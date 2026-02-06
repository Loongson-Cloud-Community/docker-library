MILVUS_VERSION  := 2.6.2
TARBALL         := milvus-$(MILVUS_VERSION)-linux-loong64.tar.gz
TARBALL_URL     := https://cloud.loongnix.cn/releases/loongarch64/milvus-io/milvus/$(MILVUS_VERSION)/$(TARBALL)

src:
	@if [ ! -d "milvus" ]; then \
                echo "Cloning milvus repository..."; \
                git clone --depth 1 -b v2.6.2-loongarch64 https://github.com/loong-hy/milvus.git; \
        else \
                echo "milvus directory already exists, skipping clone."; \
        fi
	@if [ ! -f "$(TARBALL)" ]; then \
                echo "Downloading $(TARBALL) from $(TARBALL_URL)..."; \
                wget -O "$(TARBALL)" "$(TARBALL_URL)"; \
        else \
                echo "$(TARBALL) already exists, skipping download."; \
        fi
#wget http://cloud.loongnix.cn/releases/loongarch64/milvus-io/milvus/2.6.2/milvus-2.6.2-linux-loong64.tar.gz

image:src 
	cd milvus && tar xf ../milvus-2.6.2-linux-loong64.tar.gz --strip-components=1 && bash build/build_image.sh

push:
	docker push lcr.loongnix.cn/milvusdb/milvus:2.6.2

clean:
	rm -rf milvus*
