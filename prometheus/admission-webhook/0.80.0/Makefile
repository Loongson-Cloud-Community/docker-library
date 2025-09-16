src:
	git clone --depth 1 -b v0.80.0 https://github.com/prometheus-operator/prometheus-operator && cd prometheus-operator && git apply ../0001-add-loong64-support.patch

image:
	cd prometheus-operator && docker build -t lcr.loongnix.cn/prometheus-operator/admission-webhook:0.80.0 --build-arg https_proxy=${https_proxy} -f cmd/admission-webhook/Dockerfile .

push:
	docker push lcr.loongnix.cn/prometheus-operator/admission-webhook:0.80.0

