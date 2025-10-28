FROM lcr.loongnix.cn/openanolis/anolisos:23.3

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN set -eux; \
	groupadd -r mysql && useradd -r -g mysql mysql

#RUN dnf update && dnf install -y --no-install-recommends gnupg dirmngr && rm -rf /var/lib/apt/lists/*

# add gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION 1.14
RUN set -eux; \
	curl -fL -o /usr/local/bin/gosu "https://github.com/Loongson-Cloud-Community/gosu/releases/download/1.17/gosu-loong64"; \
        chmod +x /usr/local/bin/gosu; \
        gosu --version; \
        gosu nobody true

RUN mkdir /docker-entrypoint-initdb.d

RUN set -eux; \
	dnf install -y  \
        bzip2 \
        gzip \
        openssl \
        findutils \
        perl \
        perl-File-Basename \
        perl-File-Copy \
        perl-Sys-Hostname \
        perl-Data-Dumper \
        xz \
        zstd \
        ; \
	dnf clean all


ENV MYSQL_MAJOR 5.7
ENV MYSQL_VERSION 5.7.29-2

# the "/var/lib/mysql" stuff here is because the mysql-server postinst doesn't have an explicit way to disable the mysql_install_db codepath besides having a database already "configured" (ie, stuff in /var/lib/mysql/mysql)
# also, we set debconf keys to make APT a little quieter
RUN set -eu; \
	{ \
		echo '[mysql5.7-server]'; \
                echo 'name=MySQL 5.7'; \
                echo 'enabled=1'; \
                echo 'baseurl=https://cloud.loongnix.cn/os-packages/mysql/5.7/anolis/23.3/loongarch64/'; \
                echo 'gpgcheck=0'; \
	} | tee /etc/yum.repos.d/mysql-community.repo \
	&& dnf makecache \
        && dnf install -y mysql-community-server-"${MYSQL_VERSION}".an23 \
        && dnf clean all \
# comment out a few problematic configuration values
	&& grep -F 'socket=/var/lib/mysql/mysql.sock' /etc/my.cnf \
	&& sed -i 's!^socket=.*!socket=/var/run/mysqld/mysqld.sock!' /etc/my.cnf \
	&& grep -F 'socket=/var/run/mysqld/mysqld.sock' /etc/my.cnf \
# don't reverse lookup hostnames, they are usually another container
	&& echo '[mysqld]\nskip-host-cache\nskip-name-resolve' > /etc/my.cnf.d/docker.cnf \
	&& { echo '[client]'; echo 'socket=/var/run/mysqld/mysqld.sock'; } >> /etc/my.cnf \
# make sure users dumping files in "/etc/mysql/conf.d" still works
# the rpm package has different opinions on the mode of `/var/run/mysqld`, so this needs to be after install	
	&& rm -rf /var/lib/mysql && mkdir -p /var/lib/mysql /var/run/mysqld \
	&& chown -R mysql:mysql /var/lib/mysql /var/run/mysqld \
# ensure that /var/run/mysqld (used for socket and lock files) is writable regardless of the UID our mysqld instance ends up having at runtime
	&& chmod 1777 /var/run/mysqld /var/lib/mysql \
	&& mysqld --version \
	&& mysql --version

VOLUME /var/lib/mysql

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3306 33060
CMD ["mysqld"]
