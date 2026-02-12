FROM lcr.loongnix.cn/openanolis/anolisos:23.3 as builder

RUN sed -i "s/\$releasever/23.3/g" /etc/yum.repos.d/AnolisOS.repo
RUN dnf install -y wget java-1.8.0-openjdk-devel && \
    dnf clean all && \
    wget https://dlcdn.apache.org/maven/maven-3/3.9.12/binaries/apache-maven-3.9.12-bin.tar.gz && \
    mkdir -p /opt/maven && \
    tar -xzf apache-maven-3.9.12-bin.tar.gz -C /opt/maven/ --strip-components=1

ENV MAVEN_HOME=/opt/maven
ENV PATH=$MAVEN_HOME/bin:$PATH

WORKDIR /app

COPY . .
RUN mvn clean package -DskipTests -f server/pom.xml
RUN mkdir -p /app/extracted && \
    tar -xzf /app/server/target/kkFileView-*.tar.gz -C /app/extracted --strip-components=1


FROM debian:13-slim as kkfileview-base

RUN rm -f /etc/dpkg/dpkg.cfg.d/docker

RUN sed -i 's/Components: main/Components: main non-free non-free-firmware contrib/' /etc/apt/sources.list.d/debian.sources
RUN chmod 1777 /tmp
RUN apt-get update &&\
    export DEBIAN_FRONTEND=noninteractive &&\
    apt-get install -y --no-install-recommends openjdk-8-jre tzdata locales xfonts-utils fontconfig libreoffice &&\
    echo "zh_CN.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    localedef -i zh_CN -c -f UTF-8 -A /usr/share/locale/locale.alias zh_CN.UTF-8 && \
    echo 'Asia/Shanghai' > /etc/timezone &&\
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime &&\
    apt-get install -y --no-install-recommends ttf-mscorefonts-installer \
                                               fonts-wqy-microhei ttf-wqy-zenhei xfonts-wqy &&\
    apt-get autoremove -y &&\
    apt-get clean &&\
    rm -rf /var/lib/apt/lists/*

ENV LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8


FROM kkfileview-base

COPY --from=builder /app/extracted /opt/kkFileView-4.4.0
ENV KKFILEVIEW_BIN_FOLDER=/opt/kkFileView-4.4.0/bin
ENTRYPOINT ["java","-Dfile.encoding=UTF-8","-Dsun.jnu.encoding=UTF-8","-Dspring.config.location=/opt/kkFileView-4.4.0/config/application.properties","-jar","/opt/kkFileView-4.4.0/bin/kkFileView-4.4.0.jar"]

