FROM lcr.loongnix.cn/library/php:8.3.28-cli-alpine3.23 AS binary-with-runtime

RUN set -eux ; \
  apk add --no-cache --virtual .composer-rundeps \
    7zip \
    bash \
    coreutils \
    git \
    make \
    mercurial \
    openssh-client \
    patch \
    subversion \
    tini \
    unzip \
    zip

RUN printf "# composer php cli ini settings\n\
date.timezone=UTC\n\
memory_limit=-1\n\
" > $PHP_INI_DIR/php-cli.ini

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_HOME=/tmp
ENV COMPOSER_VERSION=2.9.5

RUN set -eux ; \
  # install https://github.com/mlocati/docker-php-extension-installer
  curl \
    --silent \
    --fail \
    --location \
    --retry 3 \
    --output /usr/local/bin/install-php-extensions \
    --url https://github.com/mlocati/docker-php-extension-installer/releases/download/2.10.8/install-php-extensions \
  ; \
  echo 9acf2023a2fa5e2dc86814d058c509bf8171949331e1f3c59b1773ba26b66d78c7f25bcc42a189a80e4403307d9da17c1ca4d0b911462f79500128a234767202 /usr/local/bin/install-php-extensions | sha512sum --strict --check ; \
  chmod +x /usr/local/bin/install-php-extensions ; \
  # install necessary/useful extensions not included in base image
  install-php-extensions \
    bz2 \
    zip \
  ; \
  # install public keys for snapshot and tag validation, see https://composer.github.io/pubkeys.html
  curl \
    --silent \
    --fail \
    --location \
    --retry 3 \
    --output /tmp/keys.dev.pub \
    --url https://raw.githubusercontent.com/composer/composer.github.io/e7f28b7200249f8e5bc912b42837d4598c74153a/snapshots.pub \
  ; \
  echo 572b963c4b7512a7de3c71a788772440b1996d918b1d2b5354bf8ba2bb057fadec6f7ac4852f2f8a8c01ab94c18141ce0422aec3619354b057216e0597db5ac2 /tmp/keys.dev.pub | sha512sum --strict --check ; \
  curl \
    --silent \
    --fail \
    --location \
    --retry 3 \
    --output /tmp/keys.tags.pub \
    --url https://raw.githubusercontent.com/composer/composer.github.io/e7f28b7200249f8e5bc912b42837d4598c74153a/releases.pub \
  ; \
  echo 47f374b8840dcb0aa7b2327f13d24ab5f6ae9e58aa630af0d62b3d0ea114f4a315c5d97b21dcad3c7ffe2f0a95db2edec267adaba3f4f5a262abebe39aed3a28 /tmp/keys.tags.pub | sha512sum --strict --check ; \
  # download installer.php, see https://getcomposer.org/download/
  curl \
    --silent \
    --fail \
    --location \
    --retry 3 \
    --output /tmp/installer.php \
    --url https://raw.githubusercontent.com/composer/getcomposer.org/f24b8f860b95b52167f91bbd3e3a7bcafe043038/web/installer \
  ; \
  echo 3137ad86bd990524ba1dedc2038309dfa6b63790d3ca52c28afea65dcc2eaead16fb33e9a72fd2a7a8240afaf26e065939a2d472f3b0eeaa575d1e8648f9bf19 /tmp/installer.php | sha512sum --strict --check ; \
  # install composer phar binary
  php /tmp/installer.php \
    --no-ansi \
    --install-dir=/usr/bin \
    --filename=composer \
    --version=${COMPOSER_VERSION} \
  ; \
  composer --ansi --version --no-interaction ; \
  rm -f /tmp/installer.php ; \
  find /tmp -type d -exec chmod -v 1777 {} +

COPY docker-entrypoint.sh /docker-entrypoint.sh

WORKDIR /app

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["composer"]

FROM scratch AS standalone-binary

COPY --from=binary-with-runtime /usr/bin/composer /composer

# This is defined as last target to be backward compatible with build without explicit --target option
FROM binary-with-runtime AS default
