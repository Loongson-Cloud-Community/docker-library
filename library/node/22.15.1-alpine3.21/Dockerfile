FROM lcr.loongnix.cn/library/alpine:3.21

RUN apk add nodejs npm yarn

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["node"]

