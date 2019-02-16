# A base image with cypress and node modules installed to speed up testing
# Deploy on update using
# `gcloud builds submit .`

# adapted from
# https://glebbahmutov.com/blog/making-small-docker-image/

# Start with cypress base docker image (debian 10)
FROM cypress/base:10 as TEST
WORKDIR /app

# dependencies will be installed only if the package files change
COPY package.json .
COPY yarn.lock .

# by setting CI environment variable we switch the Cypress install messages
# to small "started / finished" and avoid 1000s of lines of progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=true
RUN yarn install
# verify that Cypress has been installed correctly.
# running this command separately from "cypress run" will also cache its result
# to avoid verifying again when running the tests
RUN npx cypress verify