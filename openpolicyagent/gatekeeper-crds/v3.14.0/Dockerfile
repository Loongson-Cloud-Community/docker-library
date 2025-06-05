FROM lcr.loongnix.cn/library/debian:13 as builder 

ARG KUBERNETES_VERSION=1.28.0
ARG TARGETPLATFORM
ARG TARGETOS
ARG TARGETARCH
COPY / /
WORKDIR /

RUN apt update -y && apt install wget -y

RUN  wget https://cloud.loongnix.cn/releases/loongarch64/kubernetes/kubernetes/v${KUBERNETES_VERSION}/kubernetes-client-linux-loong64.tar.gz \
     && tar -zxvf kubernetes-client-linux-loong64.tar.gz \
     && mv kubernetes/client/bin/kubectl /usr/local/bin/kubectl \
     && chmod +x /usr/local/bin/kubectl \
     && rm -rf kubernetes-client-linux-loong64.tar.gz \
     && rm -rf kubernetes

FROM scratch as build
USER 65532:65532
COPY --chown=65532:65532 * /crds/
COPY --from=builder /usr/local/bin/kubectl /kubectl
ENTRYPOINT ["/kubectl"]
