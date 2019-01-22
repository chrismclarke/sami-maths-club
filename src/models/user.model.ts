import { DbService } from "src/services/db.service";

export class User {
  readonly _key: string;
  _created: Date;
  _modified: Date;
  email: string;
  lastSignInTime: string;
  constructor(key: string, values: Partial<User> = {}, private db: DbService) {
    this._key = key;
    this._created = new Date();
    this._setValues(values);
  }

  public save() {
    this._modified = new Date();
    return this.db.afs.doc(`problems/${this._key}`).set(this.values());
  }

  // when getting values want only properties that are value and not methods or db
  public values() {
    const v: Partial<User> = {};
    Object.getOwnPropertyNames(this).forEach(key => {
      if (key !== "db") {
        v[key] = this[key];
      }
    });
    return v;
  }

  private _setValues(values: Partial<User>) {
    if (values) {
      Object.getOwnPropertyNames(values).forEach(k => {
        this[k] = values[k];
      });
    }
  }
}
