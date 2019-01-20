import { DbService } from "src/services/db.service";
import { IUploadedFileMeta } from "src/services/storage.service";
import { Injector } from "@angular/core";

// we want to be able to call a new problem with key/value constructor params but retain the same dbService provider
// this is achieved through use of injector
const injector = Injector.create([
  {
    provide: DbService,
    deps: []
  }
]);
export class Problem {
  readonly _key: string;
  readonly _created: Date;
  _modified: Date;
  title: string;
  slug: string;
  coverImg: string;
  studentVersion: IStudentVersion;
  facilitatorVersion: IFacilitatorVersion;
  difficulty: "easy" | "medium" | "hard";
  db: DbService;
  // call constructor with optional values to populate
  constructor(key: string, values: Partial<Problem> = {}) {
    this.db = injector.get(DbService);
    this._key = key;
    this._created = new Date();
    this._modified = new Date();
    this._setDefaults();
    this._setValues(values);
  }

  public save() {
    return this.db.afs.doc(`problems/${this._key}`).set(this.values());
  }
  public delete() {
    console.log("deleting problem");
  }
  public values() {
    const v: Partial<Problem> = {};
    Object.getOwnPropertyNames(this).forEach(key => {
      v[key] = this[key];
    });
    console.log("v", v);
    return v;
  }

  private _setDefaults() {
    this.title = null;
    this.slug = null;
    this.studentVersion = {
      content: null,
      images: []
    };
    this.facilitatorVersion = {
      solution: null,
      extension: null,
      pedagogy: null
    };
    this.difficulty = "easy";
  }

  private _setValues(values: Partial<Problem>) {
    Object.keys(values).forEach(k => {
      this[k] = values[k];
    });
  }
}

export interface IProblem extends Problem {
  _completedBy?: { ["id"]: boolean };
  _averageRating?: number;
}

interface IFacilitatorVersion {
  solution: string;
  extension: string;
  pedagogy: string;
}

interface IStudentVersion {
  content: string;
  images: IUploadedFileMeta[];
}
