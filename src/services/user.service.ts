import { Injectable } from "@angular/core";
import { User } from "src/models/user.model";
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase";
import { User as FirebaseUser } from "firebase/app";
import { DbService } from "./db.service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  public user = new BehaviorSubject<User>(null);
  constructor(public afAuth: AngularFireAuth, private db: DbService) {
    this.afAuth.authState.subscribe(user => {
      this.authChanged(user);
    });
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  googleLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  facebookLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }
  async authChanged(u: FirebaseUser | null) {
    if (u) {
      let userProfile = (await this.db.afs.firestore
        .doc(`users/${u.email}`)
        .get()).data() as Partial<User>;
      if (!userProfile || userProfile === undefined) {
        userProfile = this.updateUserProfile(u);
      }
      this.user.next(new User(u.email, userProfile, this.db));
    } else {
      this.user.next(null);
    }
  }

  updateUserProfile(u: FirebaseUser) {
    const profile: any = (({
      email,
      displayName,
      photoURL,
      uid,
      emailVerified
    }) => ({ email, displayName, photoURL, uid, emailVerified }))(u);
    profile.lastSignInTime = u.metadata.lastSignInTime;
    // don't need to wait, can just return what it will look like
    this.db.afs.firestore.doc(`users/${u.email}`).set(profile, { merge: true });
    return profile;
  }
}
