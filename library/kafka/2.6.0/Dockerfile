FROM lcr.loongnix.cn/library/debian:sid-slim
RUN mkdir -p /usr/lib/jvm/  && apt-get update && apt-get install -y  wget
ADD loongson8.1.23-fx-jdk8u452b09-linux-loongarch64-glibc2.34.tar.gz /usr/lib/jvm
ENV JAVA_HOME /usr/lib/jvm/jdk8u452-b09
ENV PATH $JAVA_HOME/bin:$PATH 
COPY kafka_2.13-2.6.0/ /opt/kafka/
WORKDIR /
ENV KAFKA_HOME=/opt/kafka PATH=${PATH}:/opt/kafka/bin
EXPOSE 9092
CMD ["kafka-server-start.sh", "/opt/kafka/config/server.properties"]
