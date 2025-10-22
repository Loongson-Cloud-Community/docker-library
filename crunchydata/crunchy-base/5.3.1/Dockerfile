FROM openanolis/anolisos:23.1

ARG RELVER=5.3.1
# For RHEL8 all arguments used in main code has to be specified after FROM

MAINTAINER Crunchy Data <info@crunchydata.com>

LABEL vendor="Crunchy Data" \
	url="https://crunchydata.com" \
	release="${RELVER}" \
	org.opencontainers.image.vendor="Crunchy Data" \
	os.version="23.1"

COPY redhat/atomic/help.1 /help.1
COPY redhat/atomic/help.md /help.md
COPY licenses /licenses

ENV BASEOS centos8
ENV PACKAGER dnf

ENV LC_ALL en_US.utf-8
ENV LANG en_US.utf-8

RUN if [ "$BASEOS" = "centos8" ] ; then \
	${PACKAGER} -y update --nodocs \
	&& ${PACKAGER} -y install \
		--setopt=skip_missing_names_on_install=False \
		--nodocs \
		glibc-langpack-en \
		bind-utils \
		gettext \
		hostname \
		procps-ng \
		nss_wrapper \
	&& ${PACKAGER} -y clean all ; \
fi
