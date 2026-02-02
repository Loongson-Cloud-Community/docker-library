# Copyright 2019 The OPA Authors.  All rights reserved.
# Use of this source code is governed by an Apache2
# license that can be found in the LICENSE file.
FROM openeuler-24.03-lts-sp3:latest AS opa-builder
RUN yum install -y git golang && \
    git clone https://github.com/open-policy-agent/opa.git && \
    cd opa && \
    git checkout v0.63.0 && \
    go env -w GOPROXY=https://goproxy.cn,direct && \
    CGO_ENABLED=1 GOFLAGS=""-buildmode=exe"" go build -tags= -o opa_linux_loong64 -ldflags " -X github.com/open-policy-agent/opa/version.Hostname=oe-15"


FROM openeuler-24.03-lts-sp3:latest 
LABEL org.opencontainers.image.authors="Torin Sandall <torinsandall@gmail.com>"
LABEL org.opencontainers.image.source="https://github.com/open-policy-agent/opa"



# Any non-zero number will do, and unfortunately a named user will not, as k8s
# pod securityContext runAsNonRoot can't resolve the user ID:
# https://github.com/kubernetes/kubernetes/issues/40958.
ARG USER=1000:1000
USER ${USER}

# TARGETOS and TARGETARCH are automatic platform args injected by BuildKit
# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG TARGETOS
ARG TARGETARCH
ARG BIN_DIR=.
ARG BIN_SUFFIX=
COPY --from=opa-builder /opa/opa_linux_loong64 /opa
ENV PATH=${PATH}:/

ENTRYPOINT ["/opa"]
CMD ["run"]
