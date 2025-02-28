FROM lcr.loongnix.cn/library/alpine:3.21
RUN apk --no-cache add ca-certificates tzdata
RUN set -ex; \
	apk --no-cache add wget; \
	wget --quiet -O /tmp/traefik.tar.gz "http://cloud.loongnix.cn/releases/loongarch64/traefik/traefik/2.10.5/traefik_v2.10.5_linux_loong64.tar.gz"; \
	tar xzvf /tmp/traefik.tar.gz -C /usr/local/bin traefik; \
	rm -f /tmp/traefik.tar.gz; \
	chmod +x /usr/local/bin/traefik; \
	apk del wget
COPY entrypoint.sh /
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["traefik"]

# Metadata
LABEL org.opencontainers.image.vendor="Traefik Labs" \
	org.opencontainers.image.url="https://traefik.io" \
	org.opencontainers.image.title="Traefik" \
	org.opencontainers.image.description="A modern reverse-proxy" \
	org.opencontainers.image.version="v2.4.9" \
	org.opencontainers.image.documentation="https://docs.traefik.io"
