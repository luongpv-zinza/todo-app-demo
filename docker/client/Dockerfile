FROM node:14.19.0-alpine

RUN apk update && apk add yarn

ARG ENVIROMENT
ENV ENVIROMENT ${ENVIROMENT}

RUN mkdir /app
WORKDIR /app
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
