# Dockerise fragment

FROM node:18-alpine AS dependencies

LABEL maintainer="Soyon Lee <slee550@myseneca.ca>" \
description="Fragment node.js microservice"

ENV NPM_CONFIG_LOGLEVEL=warn \
NPM_CONFIG_COLOR=false

# WORKDIR instruction sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD instructions
# /absoluteDir/ relativeDir/
# If a relative path is provided, it will be relative to the path of the previous WORKDIR instruction.
WORKDIR /app

# The COPY instruction copies new files or directories from <src> and adds them to the filesystem of the container at the path <dest>
COPY package*.json .

RUN npm install

########################################################

FROM node:18-alpine@sha256:e37da457874383fa9217067867ec85fe8fe59f0bfa351ec9752a95438680056e AS deploy

WORKDIR /app

COPY --from=dependencies /app . 

COPY src/ src/

COPY tests/.htpasswd tests/.htpasswd

CMD ["npm", "start"]

EXPOSE 8080