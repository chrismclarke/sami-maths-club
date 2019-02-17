# A base image with cypress and node modules installed to allow testing

# Deploy via
# `gcloud builds submit .`

FROM cypress/base:10 as TEST
# set working directory
WORKDIR /app
COPY package.json .
COPY yarn.lock .
ENV CI=true
RUN yarn install