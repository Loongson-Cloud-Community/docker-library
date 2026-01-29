FROM scratch AS binary
COPY docker-entrypoint.sh /
ADD envoy.yaml /etc/envoy/envoy.yaml
ADD https://cloud.loongnix.cn/releases/loongarch64/envoyproxy/envoy/1.35.0/envoy-static /usr/local/bin/envoy
COPY su-exec /usr/local/bin/utils/su-exec


# STAGE: envoy-base
FROM debian:unstable AS envoy-base
ENV DEBIAN_FRONTEND=noninteractive
EXPOSE 10000
CMD ["envoy", "-c", "/etc/envoy/envoy.yaml"]
RUN apt update -y \
    && apt install adduser -y
RUN mkdir -p /etc/envoy \
    && adduser --group --system envoy
ENTRYPOINT ["/docker-entrypoint.sh"]
# NB: Adding this here means that following steps, for example updating the system packages, are run
#   when the version file changes. This should mean that a release version will always update.
#   In PRs this will just use cached layers unless either this file changes or the version has changed.
ADD VERSION.txt /etc/envoy
RUN apt-get -qq update \
    && apt-get -qq upgrade -y \
    && apt-get -qq install --no-install-recommends -y ca-certificates \
    && apt-get -qq autoremove -y


# STAGE: envoy
FROM envoy-base AS envoy
COPY --from=binary --chown=0:0 --chmod=644 \
    /etc/envoy/envoy.yaml /etc/envoy/envoy.yaml
COPY --from=binary --chown=0:0 --chmod=755 \
    /docker-entrypoint.sh /
COPY --from=binary --chown=0:0 --chmod=755 \
    /usr/local/bin/utils/su-exec /usr/local/bin/
ARG ENVOY_BINARY=envoy
ARG ENVOY_BINARY_PREFIX=
COPY --from=binary --chown=0:0 --chmod=755 \
    "/usr/local/bin/${ENVOY_BINARY_PREFIX}${ENVOY_BINARY}" /usr/local/bin/envoy
COPY --from=binary --chown=0:0 --chmod=755 \
    /usr/local/bin/${ENVOY_BINARY_PREFIX}${ENVOY_BINARY}\.* /usr/local/bin/
