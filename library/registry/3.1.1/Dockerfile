FROM alpine:3.23

RUN apk add --no-cache ca-certificates

RUN set -eux; \
# https://github.com/distribution/distribution/releases
	wget -O registry.tar.gz "https://github.com/Loongson-Cloud-Community/distribution/releases/download/v3.1.1/registry_3.1.1_linux_loong64.tar.gz"; \
	tar --extract --verbose --file registry.tar.gz --directory /bin/ registry; \
	rm registry.tar.gz; \
	registry --version

COPY ./config-example.yml /etc/distribution/config.yml

ENV OTEL_TRACES_EXPORTER=none

VOLUME ["/var/lib/registry"]
EXPOSE 5000

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["/etc/distribution/config.yml"]
