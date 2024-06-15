# Dockerise fragment

# fragment image is based on node image
FROM node:20.11.0

# metadata
LABEL maintainer="Soyon Lee <slee550@myseneca.ca>"
LABEL description="Fragment node.js microservice"

# environmental variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# create & Use /app as our working directory
WORKDIR /app

# COPY source dest(image)
# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file; otherwise docker can't run based on env.jest
COPY ./tests/.htpasswd ./tests/.htpasswd

# Run the server
CMD npm start

# We run our service on port 8080
# we can access running container with localhost:8080
EXPOSE 8080