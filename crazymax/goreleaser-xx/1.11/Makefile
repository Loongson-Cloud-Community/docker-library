src: clean
	git clone --depth 1 -b v1.8.3-r0 https://github.com/crazy-max/goreleaser-xx/ 

image: src
	cp Dockerfile goreleaser-xx && cd goreleaser-xx && go get -u golang.org/x/sys/unix && docker buildx build -t lcr.loongnix.cn/crazy-max/goreleaser-xx/1.11 --build-arg https_proxy=$(https_proxy) . --load

push: clean
	docker push lcr.loongnix.cn/crazy-max/goreleaser-xx/1.11

clean:
	rm -rf goreleaser-xx
