src:
	git clone --depth 1 -b v0.11.0 https://github.com/brancz/kube-rbac-proxy
image: src
	cd kube-rbac-proxy && git apply ../0001-loong64.patch && make container
push:
	docker push lcr.loongnix.cn/brancz/kube-rbac-proxy:v0.11.0
