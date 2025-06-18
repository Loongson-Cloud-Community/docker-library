FROM lcr.loongnix.cn/openanolis/anolisos:23.2
RUN  dnf install -y python
COPY elasticsearch-8.11.0-SNAPSHOT/ /usr/share/elasticsearch/
COPY gcc123/ /usr/local/gcc123/
RUN groupadd elasticsearch && useradd -g elasticsearch elasticsearch
WORKDIR /usr/share/elasticsearch
RUN set -ex \
	&& for path in \
		./data \
		./logs \
		./config \
		./config/scripts \
	; do \
		mkdir -p "$path"; \
		chown -R elasticsearch:elasticsearch "$path"; \
	done

COPY config ./config

VOLUME /usr/share/elasticsearch/data

COPY docker-entrypoint.sh /
USER elasticsearch
EXPOSE 9200 9300
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["elasticsearch"]
