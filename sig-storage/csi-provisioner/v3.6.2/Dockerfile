FROM lcr.loongnix.cn/library/debian:sid as downloader
RUN apt update -y && apt install wget -y
RUN wget -q -O /csi-provisioner https://github.com/Loongson-Cloud-Community/external-provisioner/releases/download/v3.6.2/csi-provisioner-v3.6.2-abi2.0
# 冒烟
RUN chmod +x /csi-provisioner && /csi-provisioner --version


FROM lcr.loongnix.cn/distroless/static-debian10:latest
LABEL maintainers="Kubernetes Authors"
LABEL description="CSI External Attacher"
COPY --from=downloader /csi-provisioner /csi-provisioner
ENTRYPOINT ["/csi-provisioner"]
