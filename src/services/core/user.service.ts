import { Injectable } from "@angular/core";
import {
  User,
  IUserBase,
  IUserMeta,
  USER_API_VERSION,
  IUserValues
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
      console.log("user changed", user);
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
      let userProfile = (await this.db.getDoc("users", u.email)) as IUserValues;
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
    const meta = this.db.generateDocMeta({ _key: u.email });
    const extended: IUserMeta = {
      _apiVersion: USER_API_VERSION,
      permissions: {},
      ...meta
    };
    const userProfile: IUserValues = { ...profile, ...extended };
    this.db.setDoc("users", profile);
    // don't need to wait, can just return what it will look like
    return userProfile;
  }
}
