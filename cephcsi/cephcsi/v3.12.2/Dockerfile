#-- Downloader
FROM lcr.loongnix.cn/library/debian:sid as downloader
RUN apt update -y && apt install wget -y
RUN wget -q -O /cephcsi https://github.com/Loongson-Cloud-Community/ceph-csi/releases/download/v3.12.2/cephcsi-v3.12.2-abi2.0
RUN chmod +x /cephcsi

#-- Update base
FROM lcr.loongnix.cn/ceph/ceph:18.2.2 as updated_base

# TODO: remove the following cmd, when issues
# https://github.com/ceph/ceph-container/issues/2034
# https://github.com/ceph/ceph-container/issues/2141 are fixed.
RUN dnf config-manager --disable \
    tcmu-runner,tcmu-runner-source,tcmu-runner-noarch,ceph-iscsi,ganesha || true

RUN mkdir /etc/selinux || true && touch /etc/selinux/config

RUN dnf -y update --nobest \
       && dnf -y install nfs-utils \
       && dnf clean all \
       && rm -rf /var/cache/yum


#-- Final container
FROM updated_base

LABEL maintainers="Ceph-CSI Authors" \
    version=${CSI_IMAGE_VERSION} \
    architecture=${GO_ARCH} \
    description="Ceph-CSI Plugin"

COPY --from=downloader /cephcsi /usr/local/bin/cephcsi

# verify that all dynamically linked libraries are available
RUN [ $(ldd /usr/local/bin/cephcsi | grep -c '=> not found') = '0' ]
RUN /usr/local/bin/cephcsi -version

ENTRYPOINT ["/usr/local/bin/cephcsi"]
