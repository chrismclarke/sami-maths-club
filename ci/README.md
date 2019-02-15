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
