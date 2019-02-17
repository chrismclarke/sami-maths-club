# A base image with cypress and node modules installed to allow testing

# Deploy via
# `gcloud builds submit .`
# Is also triggered on git commit

# adapted from
# https://github.com/bahmutov/google-cloud-build-example
# note, removed additional 'prod' build which removes dev dependencies to allow faster deploy
# https://glebbahmutov.com/blog/making-small-docker-image/

# Start with cypress base docker image - this is small debian 10 with dependencies required for installing cypress
FROM cypress/base:10 as TEST
# set working directory
WORKDIR /app

# use 'cached layers' to only run npm install if dependencies changed 
# (docker creates new layers on commands, and can use cached)
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json .
COPY yarn.lock .
ENV CI=true
RUN yarn install
# CI environment suppresses cypress install messages
# https://github.com/cypress-io/cypress/issues/1243

# to avoid Docker thinking it is the same command and skipping tests have a dummy command here
# find variable that changes. For example on Zeit.co Now GitHub deploys the HOSTNAME changes
ARG HOSTNAME=3

# now we copy the rest of our source files and build
COPY . .
RUN npm run build
RUN ls -la

# run tests, docker will fail if exit code non-zero
RUN npm run test:ci

# if tests passed deploy to dev server
#FROM node:boron as DEPLOY
#RUN npm install -g firebase-tools
#ENTRYPOINT ["/usr/local/bin/firebase"]
#WORKDIR /app
#COPY --from=TEST /app/www www
#COPY --from=TEST /app/.firebaserc .
#COPY --from=TEST /app/firebase.json .
#COPY --from=TEST /app/firestore.indexes.json .
#COPY --from=TEST /app/firestore.rules .
#COPY package.json .
#RUN ls -la
#RUN npm run deploy:dev

# NOTE - additional images can be used to share some of the output from this with another container
# Create a second docker image with only the minimum required files for deploy
