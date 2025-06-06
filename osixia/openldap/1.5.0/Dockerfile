From lcr.loongnix.cn/library/debian:sid

ARG OPENLDAP_PACKAGE_VERSION=2.4.57

ARG LDAP_OPENLDAP_GID
ARG LDAP_OPENLDAP_UID

RUN apt-get -y update && apt-get install -y gcc make g++ mandoc groff-base python3
RUN if [ -z "${LDAP_OPENLDAP_GID}" ]; then groupadd -g 911 -r openldap; else groupadd -r -g ${LDAP_OPENLDAP_GID} openldap; fi \
    && if [ -z "${LDAP_OPENLDAP_UID}" ]; then useradd -u 911 -r -g openldap openldap; else useradd -r -g openldap -u ${LDAP_OPENLDAP_UID} openldap; fi
COPY openldap /src/openldap
WORKDIR /src/openldap
RUN ./configure && make depend && make && make install  
ADD add-service-available /container/tool/add-service-available
ADD service-available /container/service-available
ADD install-service  /container/tool/install-service
ADD bin/ /usr/bin/ 
RUN apt-get -y update \
    && LC_ALL=C DEBIAN_FRONTEND=noninteractive apt-get  install -y --no-install-recommends \
    ca-certificates \
    curl \
    openssl \
    && apt-get remove -y --purge --auto-remove curl ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Add service directory to /container/service
ADD docker-openldap/image/service /container/service

# Use baseimage install-service script
# https://github.com/osixia/docker-light-baseimage/blob/stable/image/tool/install-service
RUN /container/tool/install-service

# Add default env variables
ADD docker-openldap/image/environment /container/environment/99-default

# Expose default ldap and ldaps ports
EXPOSE 389 636

# Put ldap config and database dir in a volume to persist data.
# VOLUME /etc/ldap/slapd.d /var/lib/ldap
