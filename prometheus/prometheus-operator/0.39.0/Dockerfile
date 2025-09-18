FROM lcr.loongnix.cn/openeuler/openeuler:24.03-LTS-SP2 AS builder

ARG DEPENDENCIES="\
            wget"

RUN set -ex \
    && yum install -y ${DEPENDENCIES}

ENV OPERATOR=/usr/local/bin/operator

#RUN set -ex \
#    && wget -q -O ${OPERATOR} https://github.com/Loongson-Cloud-Community/prometheus-operator/releases/download/v0.39.0/prometheus-operator-abi1.0
COPY operator /usr/local/bin/
FROM lcr.loongnix.cn/library/busybox:1.32.0

COPY --from=builder  /usr/local/bin/operator /bin/operator

# On busybox 'nobody' has uid `65534'
USER 65534

ENTRYPOINT ["/bin/operator"]
