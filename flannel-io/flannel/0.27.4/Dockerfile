ARG GO_IMG=lcr.loongnix.cn/library/golang:1.24
ARG RUN_IMAGE=lcr.loongnix.cn/library/alpine:3.22

FROM ${GO_IMG} AS flannel-builder
RUN git clone https://github.com/kubernetes-sigs/iptables-wrappers.git /iptables-wrapper
WORKDIR /iptables-wrapper
RUN git checkout 5792812d9e5a5bb7f22d79d557bbfeece253343d
RUN GOARCH=loong64 make build

FROM ${RUN_IMAGE}
RUN apk update && apk upgrade
RUN apk add --no-cache iproute2 ca-certificates nftables iptables strongswan iptables-legacy && update-ca-certificates
RUN apk add wireguard-tools --no-cache
COPY flanneld /opt/bin/flanneld

COPY --from=flannel-builder /iptables-wrapper/iptables-wrapper-installer.sh /
COPY --from=flannel-builder /iptables-wrapper/bin/iptables-wrapper /
# check manually that iptables-legacy and iptables-nft are present since
# iptables-wrapper-installer.sh sanity check doesn't work for multi-arch build
RUN which iptables-legacy && which iptables-nft
RUN /iptables-wrapper-installer.sh --no-sanity-check


ENTRYPOINT ["/opt/bin/flanneld"]
