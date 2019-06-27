import { IEnvironment, BASE_ENVIRONMENT } from "./environment.base";
console.log("[ANDROID]");
// this file is copied to environment during production build
export const environment: IEnvironment = {
  ...BASE_ENVIRONMENT,
  isAndroid: true,
  production: true
};

export const firebaseConfig = {
  apiKey: "AIzaSyDTsoQR8CV_CPIgimGqa6RmEQ1HETwXvTE",
  authDomain: "sami-app-prod.firebaseapp.com",
  databaseURL: "https://sami-app-prod.firebaseio.com",
  projectId: "sami-app-prod",
  storageBucket: "sami-app-prod.appspot.com",
  messagingSenderId: "589582658576"
};
