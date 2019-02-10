import { DbService } from "src/services/db.service";

export const USER_API_VERSION = 1.1;
export class User {
  constructor(public values: IUser, private db: DbService) {
    this._checkForUpgrades();
  }

  public async save() {
    this.values._modified = new Date();
    await this.db.afs.doc(`users/${this.values.email}`).set(this.values);
    console.log("user saved");
  }

  // handle api changes to user model when required
  // could be done server side
  private _checkForUpgrades() {
    console.log("checking for upgrade", this.values._apiVersion);
    switch (this.values._apiVersion) {
      case 1.0:
        return this._checkForUpgrades();
      default:
        this.save();
        return;
    }
  }
}

/****************************************
 *  Interfaces
 * **************************************/
// properties assigned during creation
export interface IUserBase {
  displayName?: string;
  email: string;
  emailVerified: boolean;
  photoURL?: string;
  uid: string;
}
export interface IUserMeta {
  _apiVersion: number;
  _created: Date;
  _key: string;
  _modified: Date;
  permissions: IUserPermissions;
}

export interface IUser extends IUserBase, IUserMeta {}

interface IUserPermissions {
  admin?: boolean;
  editor?: boolean;
}
