FROM buildpack-deps:scm As source

ARG VERSION=5.3.1
WORKDIR /workspace

RUN git clone \
    -b v$VERSION \
    --depth=1 \
    https://github.com/CrunchyData/crunchy-containers.git \
    /workspace/crunchy-containers


FROM golang:1.23 As builder

WORKDIR /workspace

COPY --from=source /workspace/crunchy-containers crunchy-containers

RUN set -ex; \
    cd crunchy-containers; \
    go build -o bin/pgbackrest/pgbackrest ./cmd/pgbackrest


FROM lcr.loongnix.cn/crunchydata/crunchy-base:5.3.1

# For RHEL8 all arguments used in main code has to be specified after FROM
ARG BASEOS=centos8
ARG PACKAGER=dnf

ADD crunchy-backrest.repo /etc/yum.repos.d/crunchy-backrest.repo

LABEL name="pgbackrest" \
	summary="Crunchy pgBackRest ${BACKREST_VER}" \
	description="The Crunchy pgBackRest container that supports pgBackRest backups, restores, and repo functionality modes." \
	io.k8s.description="pgBackRest" \
	io.k8s.display-name="Crunchy pgBackRest" \
	io.openshift.tags="postgresql,postgres,pgbackrest,backup,database,crunchy"

# Run postgres install in separate transaction ahead of backrest for postgres user
RUN ${PACKAGER} makecache; \
        ${PACKAGER} -y install --nodocs  \
	--setopt=skip_missing_names_on_install=False \
	openssh-clients \
	openssh-server \
	bzip2 \
	lz4 \
        crunchy-backrest \
	&& ${PACKAGER} -y clean all ; \

# add postgres user and group
RUN groupadd postgres -g 26 && useradd postgres -u 26 -g 26

#COPY crunchy-backrest-2.51-1.an23.loongarch64.rpm /tmp/crunchy-backrest-2.51-1.an23.loongarch64.rpm
#
#RUN dnf install -y /tmp/crunchy-backrest-2.51-1.an23.loongarch64.rpm
# set up crunchy directory
RUN mkdir -p /opt/crunchy/bin /opt/crunchy/conf /pgdata /backrestrepo \
	/var/log/pgbackrest

# add pgbackrest-restore files
COPY --from=builder /workspace/crunchy-containers/bin/pgbackrest-restore /opt/crunchy/bin
COPY --from=builder /workspace/crunchy-containers/conf/pgbackrest-restore /opt/crunchy/conf



# add pgbackrest files
COPY --from=builder /workspace/crunchy-containers/bin/pgbackrest /opt/crunchy/bin

# add pgbackrest-common files
COPY --from=builder /workspace/crunchy-containers/bin/common /opt/crunchy/bin
COPY --from=builder /workspace/crunchy-containers/bin/pgbackrest-common /opt/crunchy/bin

# set user and group ownership
RUN chown -R postgres:postgres /opt/crunchy  \
	/backrestrepo /var/log/pgbackrest /pgdata

# add the pgbackrest-repo specific files and directories, and
# set the appropriate permissions and ownership
COPY --from=builder /workspace/crunchy-containers/bin/pgbackrest-repo /usr/local/bin
RUN chmod +x /usr/local/bin/pgbackrest-repo.sh /usr/local/bin/archive-push-s3.sh \
		/usr/local/bin/archive-push-gcs.sh \
	&& mkdir -p /etc/pgbackrest \
	&& chown -R postgres:postgres /etc/pgbackrest

RUN chmod -R g=u /etc/pgbackrest \
	&& rm -f /run/nologin

RUN mkdir /.ssh && chown postgres:postgres /.ssh && chmod o+rwx /.ssh

# remove the default spool directory so that pgBackRest does not attempt to look there when
# performing a restore (pgBackRest will not have permissions to access to this dir in all envs)
RUN rm -rf /var/spool/pgbackrest /tmp/crunchy-backrest-2.51-1.an23.loongarch64.rpm

# create necessary volumes for all modes
#
# /sshd and /backrestrepo required for the pgBackRest repo mode
# /pgdata required for the pgbackrest-restore mode
#
# The VOLUME directive must appear after all RUN directives to ensure the proper
# volume permissions are applied when building the image
VOLUME ["/sshd", "/pgdata", "/backrestrepo"]

USER 26

# Defines a unique directory name that will be utilized by the nss_wrapper in the UID script
ENV NSS_WRAPPER_SUBDIR="pgbackrest"

ENTRYPOINT ["/opt/crunchy/bin/uid_postgres.sh"]

CMD ["/opt/crunchy/bin/start.sh"]
