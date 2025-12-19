ARG BASE_IMG=lcr.loongnix.cn/distroless/static-debian12:latest
FROM ${BASE_IMG}

COPY kube-state-metrics /

USER nobody

ENTRYPOINT ["/kube-state-metrics", "--port=8080", "--telemetry-port=8081"]

EXPOSE 8080 8081