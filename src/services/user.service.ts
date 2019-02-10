import { Injectable } from "@angular/core";
import {
  User,
  IUser,
  IUserBase,
  IUserMeta,
  USER_API_VERSION
} from "src/models/user.model";
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { User as FirebaseUser, auth } from "firebase/app";
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
  logout() {
    this.afAuth.auth.signOut();
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
        .get()).data() as IUser;
      if (!userProfile || userProfile === undefined) {
        userProfile = this.createUserProfile(u);
      }
      this.user.next(new User(userProfile, this.db));
    } else {
      this.user.next(null);
    }
  }

  createUserProfile(u: FirebaseUser) {
    // deconstruct statement to assign each firebase user property to user
    const profile: IUserBase = (({
      email,
      displayName,
      photoURL,
      uid,
      emailVerified
    }) => ({ email, displayName, photoURL, uid, emailVerified }))(u);
    const extended: IUserMeta = {
      _created: new Date(),
      _key: u.email,
      _modified: new Date(),
      _apiVersion: USER_API_VERSION,
      permissions: {}
    };
    const userProfile: IUser = { ...profile, ...extended };
    this.db.afs.firestore.doc(`users/${u.email}`).set(profile, { merge: true });
    // don't need to wait, can just return what it will look like
    return userProfile;
  }
}
