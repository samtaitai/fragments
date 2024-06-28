# Dockerise fragment

FROM node:16.15.1-bullseye AS dependencies

LABEL maintainer="Soyon Lee <slee550@myseneca.ca>" \
description="Fragment node.js microservice"

ENV NPM_CONFIG_LOGLEVEL=warn \
NPM_CONFIG_COLOR=false

# WORKDIR instruction sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD instructions
# /absoluteDir/ relativeDir/
# If a relative path is provided, it will be relative to the path of the previous WORKDIR instruction.
WORKDIR /app

# The COPY instruction copies new files or directories from <src> and adds them to the filesystem of the container at the path <dest>
# ./ means current dir, app
COPY package*.json ./

RUN npm install

########################################################

FROM node:16.15.1-bullseye AS deploy

WORKDIR /app

# copy generated node_modules/ only
COPY --from=dependencies /app/node_modules ./node_modules

# copy all source codes
COPY . .

COPY tests/.htpasswd tests/.htpasswd

CMD ["npm", "start"]

EXPOSE 8080