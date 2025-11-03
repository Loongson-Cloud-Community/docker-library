# Copyright 2017 - 2025 Crunchy Data Solutions, Inc.
#
# SPDX-License-Identifier: Apache-2.0

FROM buildpack-deps:scm as source

WORKDIR /wk

RUN git clone -b main --depth=1 \
    https://github.com/CrunchyData/postgres-operator.git

RUN rm -rf postgres-operator/hack/tools/queries
COPY queries /wk/postgres-operator/hack/tools/queries 

FROM golang:1.24 AS build

ENV GOPROXY="https://goproxy.cn"
WORKDIR /usr/src/
COPY --from=source /wk/postgres-operator app

RUN set -e; \
    cd app; \
    go build ./cmd/postgres-operator; \
    go run ./hack/extract-licenses.go licenses postgres-operator; \
    find ./hack/tools/queries '(' -type d -exec chmod 0555 '{}' + ')' -o '(' -type f -exec chmod 0444 '{}' + ')'; \
    find ./licenses '(' -type d -exec chmod 0555 '{}' + ')' -o '(' -type f -exec chmod 0444 '{}' + ')';

FROM debian:forky

COPY --from=build /usr/src/app/licenses /licenses
COPY --from=build /usr/src/app/hack/tools/queries /opt/crunchy/conf
COPY --from=build /usr/src/app/postgres-operator /usr/local/bin

USER 2

CMD ["postgres-operator"]
