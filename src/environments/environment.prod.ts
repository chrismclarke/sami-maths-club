// this file is copied to environment during production build
export const environment = {
  production: true,
  VERSION: require("../../package.json").version
};

export const firebaseConfig = {
  apiKey: "AIzaSyDTsoQR8CV_CPIgimGqa6RmEQ1HETwXvTE",
  authDomain: "sami-app-prod.firebaseapp.com",
  databaseURL: "https://sami-app-prod.firebaseio.com",
  projectId: "sami-app-prod",
  storageBucket: "sami-app-prod.appspot.com",
  messagingSenderId: "589582658576"
};
