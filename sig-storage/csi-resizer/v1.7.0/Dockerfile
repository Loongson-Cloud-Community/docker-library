FROM lcr.loongnix.cn/library/debian:sid as downloader
RUN apt update -y && apt install wget -y
RUN wget -q -O /csi-resizer https://github.com/Loongson-Cloud-Community/external-resizer/releases/download/v1.7.0/csi-resizer-v1.7.0-abi2.0
# 冒烟
RUN chmod +x /csi-resizer && /csi-resizer -version
FROM lcr.loongnix.cn/distroless/static-debian10:latest
LABEL maintainers="Kubernetes Authors"
LABEL description="CSI External Attacher"
COPY --from=downloader /csi-resizer /csi-resizer
ENTRYPOINT ["/csi-resizer"]
