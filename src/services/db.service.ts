import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class DbService {
  constructor(public afs: AngularFirestore) {
    console.log("db service constructor", afs);
  }
}

// NOTE - could force offline-first approach with
// https://firebase.google.com/docs/firestore/manage-data/enable-offline
