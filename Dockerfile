# Dockerise fragment

FROM node:18-alpine AS dependencies

LABEL maintainer="Soyon Lee <slee550@myseneca.ca>" \
description="Fragment node.js microservice"

ENV NPM_CONFIG_LOGLEVEL=warn \
NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json .

RUN npm install

########################################################

FROM node:18-alpine@sha256:e37da457874383fa9217067867ec85fe8fe59f0bfa351ec9752a95438680056e AS deploy

WORKDIR /app

COPY --from=dependencies /app /app 

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD ["npm start"]

EXPOSE 8080