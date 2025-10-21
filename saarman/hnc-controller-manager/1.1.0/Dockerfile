# Build the manager binary
FROM buildpack-deps:scm As source
ENV VERSION 1.1.0

RUN git clone \
    -b v$VERSION \
    --depth=1 \
    https://github.com/kubernetes-retired/hierarchical-namespaces.git \
    /tmp/hierarchical-namespaces

FROM golang:1.21 AS builder

WORKDIR /workspace
# Copy the Go Modules manifests and all third-party libraries that are unlikely to change frequently
COPY --from=source /tmp/hierarchical-namespaces/go.mod go.mod
COPY --from=source /tmp/hierarchical-namespaces/go.sum go.sum
COPY --from=source /tmp/hierarchical-namespaces/vendor/ vendor/

# Copy the go source
COPY --from=source /tmp/hierarchical-namespaces/api/ api/
COPY --from=source /tmp/hierarchical-namespaces/cmd/ cmd/
COPY --from=source /tmp/hierarchical-namespaces/internal/ internal/

# Build
RUN CGO_ENABLED=0 GO111MODULE=on go build -a -o manager ./cmd/manager/main.go

# Copied from kubebuilder scaffold to run as nonroot at
# https://github.com/kubernetes-sigs/kubebuilder/blob/7af89cb00c224c57ece37dc14ea37caf1eb769db/pkg/scaffold/v2/dockerfile.go#L60
# Use distroless as minimal base image to package the manager binary
# Refer to https://github.com/GoogleContainerTools/distroless for more details
FROM distroless/static-debian11:nonroot
WORKDIR /
COPY --from=builder /workspace/manager .
USER nonroot:nonroot
ENTRYPOINT ["/manager"]
