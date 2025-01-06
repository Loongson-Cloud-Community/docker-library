
FROM lcr.loongnix.cn/library/debian:sid AS build


ARG TARGETARCH=RELEASE.2024-08-29T01-40-52Z
ARG RELEASE=RELEASE.2024-08-29T01-40-52Z


RUN apt update && apt install -y git wget ca-certificates


# 下载相关二进制
RUN wget https://github.com/Loongson-Cloud-Community/minio/releases/download/RELEASE.2024-08-29T01-40-52Z/minio-abi2.0.RELEASE.2024-08-29T01-40-52Z -O /usr/bin/minio && chmod +x /usr/bin/minio
RUN wget https://github.com/Loongson-Cloud-Community/mc/releases/download/RELEASE.2024-08-26T10-49-58Z/mc-abi2.0.RELEASE.2024-08-26T10-49-58Z -O /usr/bin/mc && chmod +x /usr/bin/mc
RUN wget https://github.com/Loongson-Cloud-Community/curl/releases/download/curl-8_11_1/curl-static-abi2.0 -O /usr/bin/curl && chmod +x /usr/bin/curl 

# 下载对应版本的minio源码
RUN git clone --depth=1 --branch ${RELEASE} https://github.com/minio/minio.git /minio


FROM lcr.loongnix.cn/library/debian:sid


ARG RELEASE=RELEASE.2024-08-29T01-40-52Z
LABEL name="MinIO" \
      vendor="MinIO Inc <dev@min.io>" \
      maintainer="MinIO Inc <dev@min.io>" \
      version="${RELEASE}" \
      release="${RELEASE}" \
      summary="MinIO is a High Performance Object Storage, API compatible with Amazon S3 cloud storage service." \
      description="MinIO object storage is fundamentally different. Designed for performance and the S3 API, it is 100% open-source. MinIO is ideal for large, private cloud environments with stringent security requirements and delivers mission-critical availability across a diverse range of workloads."

ENV MINIO_ACCESS_KEY_FILE=access_key \
    MINIO_SECRET_KEY_FILE=secret_key \
    MINIO_ROOT_USER_FILE=access_key \
    MINIO_ROOT_PASSWORD_FILE=secret_key \
    MINIO_KMS_SECRET_KEY_FILE=kms_master_key \
    MINIO_UPDATE_MINISIGN_PUBKEY="RWTx5Zr1tiHQLwG9keckT0c45M3AGeHD6IvimQHpyRywVWGbP1aVSGav" \
    MINIO_CONFIG_ENV_FILE=config.env \
    MC_CONFIG_DIR=/tmp/.mc

COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /usr/bin/minio* /usr/bin/
COPY --from=build /usr/bin/mc* /usr/bin/
COPY --from=build /usr/bin/curl* /usr/bin/

COPY --from=build /minio/CREDITS /licenses/CREDITS
COPY --from=build /minio/LICENSE /licenses/LICENSE
COPY --from=build /minio/dockerscripts/docker-entrypoint.sh /usr/bin/docker-entrypoint.sh

EXPOSE 9000
VOLUME ["/data"]
ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["minio"]

