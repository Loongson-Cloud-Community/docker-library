#!/bin/bash
# 推送本地所有lcr镜像

IMAGES_TO_PUSH=$(docker images | grep lcr | awk '{print $1":"$2}')

for IMAGE in $IMAGES_TO_PUSH; do
	echo "push $IMAGE"
	docker push $IMAGE
done

echo "PUSH DONE!"

