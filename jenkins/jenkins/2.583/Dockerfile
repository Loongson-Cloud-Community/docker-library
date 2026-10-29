ARG JENKINS_VERSION=2.583

FROM lcr.loongnix.cn/library/alpine:latest AS jenkins-war

SHELL ["/bin/ash", "-o", "pipefail", "-c"]

RUN apk add --no-cache \
    ca-certificates \
    curl \
    gnupg

ARG JENKINS_VERSION

COPY jenkins.io-2026.key /war/jenkins-key.pub

ARG WAR_URL=https://get.jenkins.io/war/${JENKINS_VERSION}/jenkins.war

RUN test "${JENKINS_VERSION}" = "2.583" \
  && mkdir -p /war \
  && curl -fsSL "${WAR_URL}" -o /war/jenkins.war \
  && curl -fsSL "${WAR_URL}.sha256" -o /war/jenkins.war.sha256 \
  && curl -fsSL "${WAR_URL}.asc" -o /war/jenkins.war.asc \
  && cd /war \
  && sha256sum -c jenkins.war.sha256 \
  && gpg --import /war/jenkins-key.pub \
  && gpg --verify --trust-model direct /war/jenkins.war.asc /war/jenkins.war
FROM lcr.loongnix.cn/library/alpine:latest AS controller

RUN apk add --no-cache \
    bash \
    coreutils \
    curl \
    git \
    git-lfs \
    musl-locales \
    musl-locales-lang \
    openssh-client-default \
    tini \
    font-dejavu \
    tzdata \
    unzip \
    openjdk25-loongarch-jre-headless \
    openjdk25-loongarch-jre \
  && git lfs install --skip-repo --system

ENV LANG=C.UTF-8

ARG TARGETARCH
ARG COMMIT_SHA
ARG JENKINS_VERSION

ARG user=jenkins
ARG group=jenkins
ARG uid=1000
ARG gid=1000
ARG http_port=8080
ARG agent_port=50000
ARG JENKINS_HOME=/var/jenkins_home
ARG REF=/usr/share/jenkins/ref

ENV JENKINS_HOME=$JENKINS_HOME
ENV JENKINS_SLAVE_AGENT_PORT=${agent_port}
ENV REF=$REF

RUN mkdir -p $JENKINS_HOME \
  && chown ${uid}:${gid} $JENKINS_HOME \
  && addgroup -g ${gid} ${group} \
  && adduser -h "$JENKINS_HOME" -u ${uid} -G ${group} -s /bin/bash -D ${user}

VOLUME $JENKINS_HOME

RUN mkdir -p ${REF}/init.groovy.d

ENV JENKINS_UC=https://updates.jenkins.io
ENV JENKINS_UC_EXPERIMENTAL=https://updates.jenkins.io/experimental
ENV JENKINS_INCREMENTALS_REPO_MIRROR=https://repo.jenkins-ci.org/incrementals
RUN chown -R ${user} "$JENKINS_HOME" "$REF"

ARG PLUGIN_CLI_VERSION=2.15.0
ARG PLUGIN_CLI_URL=https://github.com/jenkinsci/plugin-installation-manager-tool/releases/download/${PLUGIN_CLI_VERSION}/jenkins-plugin-manager-${PLUGIN_CLI_VERSION}.jar
RUN test "${PLUGIN_CLI_VERSION}" = "2.15.0" \
  && curl -fsSL "${PLUGIN_CLI_URL}" -o /opt/jenkins-plugin-manager.jar \
  && curl -fsSL "${PLUGIN_CLI_URL}.sha256" -o /tmp/jpm.sha256 \
  && expected="$(awk '{print $1}' /tmp/jpm.sha256)" \
  && test "${expected}" = "a86853ec2e2933f37a4b471ba65099b61e03c87a80c2ef8fe2315eb135672d43" \
  && printf '%s  %s\n' "$expected" /opt/jenkins-plugin-manager.jar | sha256sum -c --strict - \
  && rm -f /tmp/jpm.sha256

EXPOSE ${http_port}
EXPOSE ${agent_port}

ENV COPY_REFERENCE_FILE_LOG=$JENKINS_HOME/copy_reference_file.log

ENV JAVA_HOME=/usr/lib/jvm/java-25-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"
COPY --from=jenkins-war /war/jenkins.war /usr/share/jenkins/jenkins.war

USER ${user}

COPY jenkins-support /usr/local/bin/jenkins-support
COPY jenkins.sh /usr/local/bin/jenkins.sh
COPY jenkins-plugin-cli.sh /bin/jenkins-plugin-cli

ENV JENKINS_VERSION=${JENKINS_VERSION}

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/jenkins.sh"]

LABEL \
    org.opencontainers.image.vendor="Jenkins project" \
    org.opencontainers.image.title="Official Jenkins Docker image" \
    org.opencontainers.image.description="The Jenkins Continuous Integration and Delivery server" \
    org.opencontainers.image.version="${JENKINS_VERSION}" \
    org.opencontainers.image.url="https://www.jenkins.io/" \
    org.opencontainers.image.source="https://github.com/jenkinsci/docker" \
    org.opencontainers.image.revision="${COMMIT_SHA}" \
    org.opencontainers.image.licenses="MIT"
