# Dockerfile
FROM node:14.16.0-alpine3.13
# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

RUN apk add --update --no-cache python2 make gcc libsass g++
# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV SITE_PORT=3000
