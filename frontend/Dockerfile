# Dockerfile
FROM node:14.16.0-alpine3.13
# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

RUN apk add --update --no-cache python2 make gcc libsass g++
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
RUN npm install -g npm@8.9.0

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV SITE_PORT=3000
