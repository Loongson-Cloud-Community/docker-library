FROM lcr.loongnix.cn/library/alpine:3.21
LABEL maintainer="doupengda@loongson.cn"

ENV KUBECTL_VERSION=v1.27.12
ENV HELM_VERSION=3.12.0
ENV KUSTOMIZE_VERSION=5.3
ARG TARGETOS
ARG TARGETARCH

RUN apk update && apk add \
   bash \
   bash-completion \
   busybox-extras \
   net-tools \
   vim \
   curl \
   jq \
   grep \
   wget \
   tcpdump \
   git \
   ca-certificates && \
   update-ca-certificates && \
   rm -rf /var/cache/apk/* && \
   curl --retry 5 --retry-delay 10 --connect-timeout 30 -L -o helm.tar.gz https://cloud.loongnix.cn/releases/loongarch64/helm/helm/3.12.0/helm-v3.12.0-linux_loong64.tar.gz && \
   tar -xzf helm.tar.gz -C /usr/local/bin && \
   mv /usr/local/bin/${TARGETOS}_${TARGETARCH}/helm /usr/local/bin && \
   rm helm.tar.gz && \
   rm -rf /usr/local/bin/${TARGETOS}_${TARGETARCH} && \
   helm plugin install https://github.com/Loongson-Cloud-Community/helm-mapkubeapis && \
   apk del git

RUN curl -LO https://cloud.loongnix.cn/releases/loongarch64/kubernetes/kubernetes/${KUBECTL_VERSION}/kubernetes-client-${TARGETOS}-${TARGETARCH}.tar.gz && \
    tar -xzf kubernetes-client-${TARGETOS}-${TARGETARCH}.tar.gz -C /usr/local/bin && \
    mv /usr/local/bin/kubernetes/client/bin/kubectl /usr/local/bin && \
    chmod +x /usr/local/bin/kubectl && \
    rm -rf kubernetes-client-${TARGETOS}_${TARGETARCH}.tar.gz && \
    rm -rf /usr/local/bin/kubernetes && \
    echo -e 'source /usr/share/bash-completion/bash_completion\nsource <(kubectl completion bash)' >>~/.bashrc

RUN curl -SsLO https://cloud.loongnix.cn/releases/loongarch64/kubernetes-sigs/kustomize/${KUSTOMIZE_VERSION}/kustomize-${TARGETOS}-${TARGETARCH}.tar.gz && \
    tar xvzf kustomize-${TARGETOS}-${TARGETARCH}.tar.gz && \
    mv kustomize /usr/local/bin/ && \
    rm kustomize-${TARGETOS}-${TARGETARCH}.tar.gz

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]


