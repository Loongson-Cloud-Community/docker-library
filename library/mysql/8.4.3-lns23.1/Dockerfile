FROM lcr.loongnix.cn/loongnix/loongnix-server:23.1

RUN set -eux; \
	groupadd --system --gid 1999 mysql; \
	useradd --system --uid 1999 --gid 1999 --home-dir /var/lib/mysql --no-create-home mysql

# add gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION 1.17
RUN set -eux; \
	curl -fL -o /usr/local/bin/gosu "https://github.com/Loongson-Cloud-Community/gosu/releases/download/1.17/gosu-loong64"; \
	chmod +x /usr/local/bin/gosu; \
	gosu --version; \
	gosu nobody true

RUN set -eux; \
	dnf install -y \
		bzip2 \
		gzip \
		openssl \
		xz \
		zstd \
		findutils \
	; \
	dnf clean all


ENV MYSQL_MAJOR 8.4
ENV MYSQL_VERSION 8.4.3

RUN set -eu; \
	{ \
		echo '[mysql8.4-server]'; \
		echo 'name=MySQL 8.4'; \
		echo 'enabled=1'; \
		echo 'baseurl=http://cloud.loongnix.cn/os-packages/loongnix-server/23.1/mysql-8.4/loongarch64'; \
		echo 'gpgcheck=0'; \
	} | tee /etc/yum.repos.d/mysql-community.repo; \
	dnf makecache

RUN set -eux; \
	dnf makecache; \
	dnf install -y "mysql-community-server"; \
	dnf clean all; \
# the "socket" value in the Oracle packages is set to "/var/lib/mysql" which isn't a great place for the socket (we want it in "/var/run/mysqld" instead)
# https://github.com/docker-library/mysql/pull/680#issuecomment-636121520
	grep -F 'socket=/var/lib/mysql/mysql.sock' /etc/my.cnf; \
	sed -i 's!^socket=.*!socket=/var/run/mysqld/mysqld.sock!' /etc/my.cnf; \
	grep -F 'socket=/var/run/mysqld/mysqld.sock' /etc/my.cnf; \
	{ echo '[client]'; echo 'socket=/var/run/mysqld/mysqld.sock'; } >> /etc/my.cnf; \
	\
# make sure users dumping files in "/etc/mysql/conf.d" still works
	! grep -F '!includedir' /etc/my.cnf; \
	{ echo; echo '!includedir /etc/mysql/conf.d/'; } >> /etc/my.cnf; \
	mkdir -p /etc/mysql/conf.d; \
# ensure these directories exist and have useful permissions
# the rpm package has different opinions on the mode of `/var/run/mysqld`, so this needs to be after install
	mkdir -p /var/lib/mysql /var/run/mysqld; \
	chown mysql:mysql /var/lib/mysql /var/run/mysqld; \
# ensure that /var/run/mysqld (used for socket and lock files) is writable regardless of the UID our mysqld instance ends up having at runtime
	chmod 1777 /var/lib/mysql /var/run/mysqld; \
	\
	mkdir /docker-entrypoint-initdb.d; \
	\
	mysqld --version; \
	mysql --version

RUN set -eu; \
	{ \
		echo '[mysql-tools-community]'; \
		echo 'name=MySQL Tools Community'; \
		echo 'baseurl=http://cloud.loongnix.cn/os-packages/loongnix-server/23.1/mysql-tools-8.4/loongarch64'; \
		echo 'enabled=1'; \
		echo 'gpgcheck=0'; \
	} | tee /etc/yum.repos.d/mysql-community-tools.repo

ENV MYSQL_SHELL_VERSION 8.4.3-1.lns23
RUN set -eux; \
	dnf install -y "mysql-shell-$MYSQL_SHELL_VERSION"; \
	dnf clean all; \
	\
	mysqlsh --version

VOLUME /var/lib/mysql

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3306 33060
CMD ["mysqld"]
