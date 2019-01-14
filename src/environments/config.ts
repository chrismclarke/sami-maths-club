/***************************************************************************************
Switch config dependent on use case

For our use case the production config is stored in environment variables passed from
Travis-CI.
Dev config is hardcoded - it is recommended if changing for production to hide the
details via gitignore. You can find more information about potential security risk here:
https://javebratt.com/hide-firebase-api/
*****************************************************************************************/
declare const process: any;
let config: any;

const devConfig = {
  apiKey: "AIzaSyCpcf8c0_n18mMKp2e7wWclFDeCidivXek",
  authDomain: "sami-app-dev.firebaseapp.com",
  databaseURL: "https://sami-app-dev.firebaseio.com",
  projectId: "sami-app-dev",
  storageBucket: "sami-app-dev.appspot.com",
  messagingSenderId: "326168056354"
};

// different production site config pulled from environment variable
const productionSites = ["mathsclub.samicharity.co.uk"];
if (productionSites.indexOf(window.location.host) > -1) {
  const e = process.env;
  config = {
    apiKey: e.FIREBASE_API_KEY,
    authDomain: e.FIREBASE_AUTH_DOMAIN,
    databaseURL: e.FIREBASE_DATABASE_URL,
    projectId: e.FIREBASE_PROJECT_ID,
    storageBucket: e.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: e.FIREBASE_MESSAGING_SENDER_ID
  };
} else {
  config = devConfig;
}
export const FIREBASE_CONFIG = config;
