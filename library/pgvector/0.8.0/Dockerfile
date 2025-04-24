ARG PG_MAJOR=17
FROM lcr.loongnix.cn/library/postgres:$PG_MAJOR-sid
ARG PG_MAJOR

#https://github.com/pgvector/pgvector/archive/refs/tags/v0.8.0.tar.gz
COPY v0.8.0.tar.gz /tmp/pgvector/
RUN tar -xf /tmp/pgvector/v0.8.0.tar.gz  --strip-components=1 -C /tmp/pgvector && \
	rm -rf /tmp/pgvector/v0.8.0.tar.gz 

RUN apt-get update && \
		apt-mark hold locales && \
		apt-get install -y --no-install-recommends build-essential postgresql-server-dev-$PG_MAJOR && \
		cd /tmp/pgvector && \
		make clean && \
		make OPTFLAGS="" && \
		make install && \
		mkdir /usr/share/doc/pgvector && \
		cp LICENSE README.md /usr/share/doc/pgvector && \
		rm -r /tmp/pgvector && \
		apt-get remove -y build-essential postgresql-server-dev-$PG_MAJOR && \
		apt-get autoremove -y && \
		apt-mark unhold locales && \
		rm -rf /var/lib/apt/lists/*
