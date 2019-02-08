# SAMI Maths Club App

This application provides access to mathematical problems and puzzles for use in schools (focus UK & Kenya).

## Development Notes

### Getting Started

1. Install Dependencies
   `yarn install`

2. Install global dependencies
   `npm install -g ionic`

3. Server locally
   `ionic serve`

### Recommended Environment

VSCode, extensions: Prettier, TSLint

Prettier and Codelyzer are both used to provide opinionated formatting.

node version 10.x

### Issues

Github issues can be viewed on waffle: https://waffle.io/chrismclarke/sami-maths-club

### Common tasks

#### Add a page

`ionic g page pages/pageName`

#### Add a service provider

`ionic g service seervices/myService`

### Known issues

Production build:
Angular fire can only target es5
https://github.com/angular/angularfire2/issues/1987

Angular fire also requires firebase 5.7.0(?) (update in future)
https://github.com/angular/angularfire2/issues/1993

### Service worker config

App aims to cache all local assets and downloaded too
(note requires cors: https://firebase.google.com/docs/storage/web/download-files#cors_configuration)

https://angular.io/guide/service-worker-config
https://medium.com/bratislava-angular/service-workers-angular-3c1551f0c203
https://itnext.io/build-a-production-ready-pwa-with-angular-and-firebase-8f2a69824fcc
https://firebase.google.com/docs/hosting/full-config#headers

Could also cache api calls, however not currently required as firestore has own cache
(would be useful if other external apis)

Note, local serve will fail as expecting gzip
