ARG BASE_IMG=lcr.loongnix.cn/kubernetes-build-image/distroless-iptables:v0.7.3
FROM ${BASE_IMG}
ADD bin/node-cache /node-cache
EXPOSE 53 53/udp
EXPOSE 53 53/tcp
ENTRYPOINT ["/node-cache"]
