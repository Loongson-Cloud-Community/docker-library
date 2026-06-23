ARG NODE_VERSION=24.16.0
ARG N8N_VERSION=snapshot

# Builder stage exists because the runtime base image has no toolchain.
# Pinned to multi-arch index digest (linux/amd64 + linux/arm64) for reproducible builds.
# Bump the digest together with the tag when updating the base image.
#FROM node:24.15.0-alpine3.22@sha256:b689d4005875ae167178471a7a622ec2909459a3bbb32277260be1971af7a99f AS builder
FROM lcr.loongnix.cn/library/node:24.16.0-alpine3.22 AS builder

# 该部分在 x86 上编译，拷贝过来
COPY ./compiled /usr/local/lib/node_modules/n8n
#RUN apk add --no-cache python3 make g++ && \
#    cd /usr/local/lib/node_modules/n8n && \
#    npm install sqlite3@latest --save-exact && \
#    npm rebuild sqlite3 && \
#    # Rebuild isolated-vm from source. node-gyp-build's musl detection relies
#    # on /etc/alpine-release which DHI Alpine omits, so the bundled prebuilt
#    # loader picks the glibc binary and segfaults in musl pthread paths.
#    # Removing prebuilds and invoking node-gyp directly avoids npm rebuild's
#    # double-build behavior (built-in node-gyp + install-script node-gyp)
#    # which races on dep-file state.
#    rm -rf node_modules/isolated-vm/prebuilds && \
#    cd node_modules/isolated-vm && \
#    npx --yes node-gyp rebuild --release -j max

RUN apk add --no-cache python3 make g++

# 重编译 sqlite3 (用 node-gyp 直接编译, 不用 npm rebuild, 避免 pnpm 结构问题)
RUN cd /usr/local/lib/node_modules/n8n/node_modules/.pnpm/sqlite3@5.1.7/node_modules/sqlite3 && \
    node /usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js rebuild --release -j max

# 重编译 isolated-vm
RUN rm -rf /usr/local/lib/node_modules/n8n/node_modules/isolated-vm/prebuilds && \
    cd /usr/local/lib/node_modules/n8n/node_modules/isolated-vm && \
    node /usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js rebuild --release -j max

# Pinned to multi-arch index digest (linux/amd64 + linux/arm64) for reproducible builds.
# n8nio/base is republished by a separate workflow (docker/images/n8n-base) on every
# base change, so a base rebuild does not reach this image until the digest is
# manually re-pinned here. Bump the digest together with the tag whenever the base
# image is intentionally updated.
FROM n8n-base

ARG N8N_VERSION
ARG N8N_RELEASE_TYPE=dev
ENV NODE_ENV=production
ENV N8N_RELEASE_TYPE=${N8N_RELEASE_TYPE}
ENV SHELL=/bin/sh

WORKDIR /home/node

COPY --from=builder /usr/local/lib/node_modules/n8n /usr/local/lib/node_modules/n8n
COPY docker/images/n8n/docker-entrypoint.sh /

RUN ln -s /usr/local/lib/node_modules/n8n/bin/n8n /usr/local/bin/n8n && \
    mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node && \
    rm -rf /root/.npm /tmp/*

EXPOSE 5678/tcp
USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]

LABEL org.opencontainers.image.title="n8n" \
      org.opencontainers.image.description="Workflow Automation Tool" \
      org.opencontainers.image.source="https://github.com/n8n-io/n8n" \
      org.opencontainers.image.url="https://n8n.io" \
      org.opencontainers.image.version=${N8N_VERSION}
