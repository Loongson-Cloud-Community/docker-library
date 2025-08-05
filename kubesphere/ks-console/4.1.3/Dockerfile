FROM lcr.loongnix.cn/loongnix/loongnix-server:23.1
RUN dnf install -y npm

COPY console/dist/  /opt/kubesphere/console/dist/
COPY console/package.json /opt/kubesphere/console/
COPY console/server/locales  /opt/kubesphere/console/server/locales
COPY console/server/public  /opt/kubesphere/console/server/public
COPY console/server/views  /opt/kubesphere/console/server/views
COPY console/server/sample /opt/kubesphere/console/server/sample
COPY console/server/configs /opt/kubesphere/console/server/configs
COPY console/hack/version.sh /version.sh

RUN ls /opt/kubesphere/console/server/

RUN /version.sh > /opt/kubesphere/console/version.txt


RUN groupadd -g 1002 kubesphere && \
    adduser -g kubesphere -u 1002 kubesphere && \
    mkdir -p /opt/kubesphere/console && \
    chown -R kubesphere:kubesphere /opt/kubesphere/console


WORKDIR /opt/kubesphere/console

RUN mv dist/server.js server/server.js
USER kubesphere

EXPOSE 8080

CMD ["npm", "run", "serve"]
