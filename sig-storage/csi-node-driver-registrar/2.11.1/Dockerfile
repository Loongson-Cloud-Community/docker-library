FROM lcr.loongnix.cn/library/debian:sid as downloader
RUN apt update -y && apt install wget -y
RUN wget -q -O /csi-node-driver-registrar https://github.com/Loongson-Cloud-Community/node-driver-registrar/releases/download/v2.11.1/csi-node-driver-registrar-v2.11.1-abi2.0
# 冒烟
RUN chmod +x /csi-node-driver-registrar && /csi-node-driver-registrar -version


FROM lcr.loongnix.cn/library/debian:sid
LABEL maintainers="Kubernetes Authors"
LABEL description="CSI External Attacher"
COPY --from=downloader /csi-node-driver-registrar /csi-node-driver-registrar
ENTRYPOINT ["/csi-node-driver-registrar"]
