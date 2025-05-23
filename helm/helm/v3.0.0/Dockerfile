FROM lcr.loongnix.cn/library/debian:sid-slim
COPY src/helm/bin/helm /usr/local/bin/
RUN chmod +x /usr/local/bin/helm 
ENTRYPOINT ["helm"]
CMD ["--help"]
