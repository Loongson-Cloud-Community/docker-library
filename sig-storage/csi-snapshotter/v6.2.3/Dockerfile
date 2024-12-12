FROM lcr.loongnix.cn/library/debian:sid as downloader
RUN apt update -y && apt install wget -y
RUN wget -q -O /csi-snapshotter https://github.com/Loongson-Cloud-Community/external-snapshotter/releases/download/v6.2.3/csi-snapshotter-v6.2.3-abi2.0
# 冒烟
RUN chmod +x /csi-snapshotter && /csi-snapshotter -version
FROM lcr.loongnix.cn/distroless/static-debian10:latest
LABEL maintainers="Kubernetes Authors"
LABEL description="CSI External Attacher"
COPY --from=downloader /csi-snapshotter /csi-snapshotter
ENTRYPOINT ["/csi-snapshotter"]
