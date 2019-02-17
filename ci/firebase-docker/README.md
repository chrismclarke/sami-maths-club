These files contain a base image of firebase tools to use with custom build scripts
Submit to gcloud build using following command from project root directory:

`cd ci`
`gcloud builds submit .`

Note, the cloudbuild.yaml file here is mostly a placeholder.
It could be connected to full package if wanting faster builds (preinstalled npm scripts),
however this would need updating whenever dependencies are updated.

Deploy logic for the app is in the root other yaml files.
Assumes IAM for firebase, see here for guidance:
https://fireship.io/lessons/ci-cd-with-google-cloud-build/

More general info:

cloud build supports a base docker image
there is a default 'yarn' image but that just builds on the default node image (which comes with yarn)

```
steps:
- name: node:10.15.1
  entrypoint: yarn
  args: ['install']
```

A custom docker image allows full customisation of a platform, and can have things
like global variables, cypress installed, node modules already installed etc.

Links:
https://github.com/cypress-io/cypress-docker-images/tree/master/base/10
https://cloud.google.com/cloud-build/docs/build-config
https://glebbahmutov.com/blog/making-small-docker-image/
