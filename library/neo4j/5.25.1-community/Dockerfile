FROM lcr.loongnix.cn/library/debian:sid
ENV JAVA_HOME=/opt/java/openjdk
COPY --from=lcr.loongnix.cn/library/openjdk:17 $JAVA_HOME $JAVA_HOME
ENV PATH="${JAVA_HOME}/bin:${PATH}" \
    NEO4J_SHA256=582ccaf9863ba039c37583690b20ebeaa10128e8876fb5e0701a21901dd7bbb4 \
    NEO4J_TARBALL=neo4j-community-5.25.1-unix.tar.gz \
    NEO4J_EDITION=community \
    NEO4J_HOME="/var/lib/neo4j" \
    LANG=C.UTF-8
ARG NEO4J_URI=http://cloud.loongnix.cn/releases/loongarch64/neo4j/neo4j/5.25.1/neo4j-community-5.25.1-unix.tar.gz

COPY ./local-package/* /startup/
#COPY neo4j-community-5.25.1-unix.tar.gz neo4j-community-5.25.1-unix.tar.gz
RUN curl --fail --silent --show-error --location --remote-name ${NEO4J_URI}

RUN apt update \
    && apt-get install -y curl gcc git jq make procps tini wget adduser \
    && addgroup --gid 7474 --system neo4j && adduser --uid 7474 --system --no-create-home --home "${NEO4J_HOME}" --ingroup neo4j neo4j \
    && echo "${NEO4J_SHA256}  ${NEO4J_TARBALL}" | sha256sum -c --strict --quiet \
    && tar --extract --file ${NEO4J_TARBALL} --directory /var/lib \
    && mv /var/lib/neo4j-* "${NEO4J_HOME}" \
    && rm ${NEO4J_TARBALL} \
    && sed -i 's/Package Type:.*/Package Type: docker bullseye/' $NEO4J_HOME/packaging_info \
    && mv /startup/neo4j-admin-report.sh "${NEO4J_HOME}"/bin/neo4j-admin-report \
    && mv "${NEO4J_HOME}"/data /data \
    && mv "${NEO4J_HOME}"/logs /logs \
    && chown -R neo4j:neo4j /data \
    && chmod -R 777 /data \
    && chown -R neo4j:neo4j /logs \
    && chmod -R 777 /logs \
    && chown -R neo4j:neo4j "${NEO4J_HOME}" \
    && chmod -R 777 "${NEO4J_HOME}" \
    && chmod -R 755 "${NEO4J_HOME}/bin" \
    && ln -s /data "${NEO4J_HOME}"/data \
    && ln -s /logs "${NEO4J_HOME}"/logs \
    && git clone https://github.com/ncopa/su-exec.git \
    && cd su-exec \
    && git checkout 4c3bb42b093f14da70d8ab924b487ccfbb1397af \
    && echo d6c40440609a23483f12eb6295b5191e94baf08298a856bab6e15b10c3b82891 su-exec.c | sha256sum -c \
    && echo 2a87af245eb125aca9305a0b1025525ac80825590800f047419dc57bba36b334 Makefile | sha256sum -c \
    && make \
    && mv /su-exec/su-exec /usr/bin/su-exec \
    && apt-get -y purge --auto-remove curl gcc git make \
    && rm -rf /var/lib/apt/lists/* /su-exec


ENV PATH "${NEO4J_HOME}"/bin:$PATH

WORKDIR "${NEO4J_HOME}"

VOLUME /data /logs

EXPOSE 7474 7473 7687

ENTRYPOINT ["tini", "-g", "--", "/startup/docker-entrypoint.sh"]
CMD ["neo4j"]
