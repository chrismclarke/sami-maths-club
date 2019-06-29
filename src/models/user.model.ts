import { DbService } from "src/services/core/db.service";
import { IDBDoc } from "./common.model";

export const USER_API_VERSION = 1.1;
export class User {
  constructor(public values: IUserValues, private db: DbService) {
    this._checkForUpgrades();
  }

  public async save() {
    await this.db.setDoc("users", this.values);
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
export interface IUserMeta extends IDBDoc {
  _apiVersion: number;
  _key: string;
  permissions: IUserPermissions;
}

export interface IUserValues extends IUserBase, IUserMeta {}

interface IUserPermissions {
  admin?: boolean;
  editor?: boolean;
}
