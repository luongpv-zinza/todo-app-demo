FROM php:8.2.0-fpm-alpine3.17
WORKDIR /app

RUN apk update && \
    docker-php-ext-install pdo_mysql

ARG DOCKER_UID
ARG DOCKER_GID

RUN if [ ${DOCKER_UID:-0} -ne 0 ] && [ ${DOCKER_GID:-0} -ne 0 ]; then \
    deluser www-data &&\
    if getent group www-data ; then delgroup www-data; fi &&\
    addgroup -g ${DOCKER_GID} www-data &&\
    adduser -u ${DOCKER_UID} -G www-data www-data --disabled-password &&\
    install -d -m 0755 -o www-data -g www-data /home/www-data \
;fi

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
