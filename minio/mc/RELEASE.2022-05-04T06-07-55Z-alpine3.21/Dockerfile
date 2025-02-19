
FROM lcr.loongnix.cn/library/alpine:3.21.0 AS build

RUN apk add ca-certificates wget

RUN wget https://github.com/Loongson-Cloud-Community/mc/releases/download/RELEASE.2022-05-04T06-07-55Z/mc-abi2.0.RELEASE.2022-05-04T06-07-55Z  -O /usr/bin/mc && chmod +x /usr/bin/mc

FROM lcr.loongnix.cn/library/alpine:3.21.0

# On Alpine the certificate bundle is located at:
# - /etc/ssl/certs/ca-certificates.crt
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY CREDITS /licenses/CREDITS
COPY LICENSE /licenses/LICENSE

COPY --from=build /usr/bin/mc /usr/bin/

RUN mc --version


ENTRYPOINT ["mc"]


