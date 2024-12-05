FROM lcr.loongnix.cn/library/debian:sid as downloader

RUN apt update -y && apt install wget -y
RUN wget -q -O /csi-attacher https://github.com/Loongson-Cloud-Community/external-attacher/releases/download/v4.6.1/csi-attacher-v4.6.1-abi2.0 && chmod +x /csi-attacher
RUN /csi-attacher -version

FROM lcr.loongnix.cn/distroless/static-debian10:latest
LABEL maintainers="Kubernetes Authors"
LABEL description="CSI External Attacher"

COPY --from=downloader /csi-attacher /csi-attacher


ENTRYPOINT ["/csi-attacher"]
