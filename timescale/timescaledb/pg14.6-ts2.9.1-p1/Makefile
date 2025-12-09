src:
	git clone --depth 1 -b loong64-pg17 https://github.com/Loongson-Cloud-Community/timescaledb-docker src
image: src
	cd src && make image
push:
	docker tag timescaledev/timescaledb:main-pg17 lcr.loongnix.cn/timescaledev/timescaledb:main-pg17
	docker push lcr.loongnix.cn/timescaledev/timescaledb:main-pg17

