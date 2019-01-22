import { DbService } from "src/services/db.service";
import { IUploadedFileMeta } from "src/services/storage.service";
import { SafeHtml } from "@angular/platform-browser";
import { Timestamp } from "firebase/firestore";

export class Problem {
  readonly _key: string;
  // storing as date but sometimes firestore sends back own timestamp format
  readonly _created: Date | Timestamp;
  _modified: Date | Timestamp;
  title: string;
  slug: string;
  createdBy: string;
  isApproved: boolean;
  coverSVG: string | SafeHtml;
  studentVersion: IStudentVersion;
  facilitatorVersion: IFacilitatorVersion;
  locked: boolean;
  difficulty: "easy" | "medium" | "hard";
  // call constructor with optional values to populate
  // NOTE - we want to instantiate 'new' problems but will still need to pass the shared dbService (save creating a new one)
  constructor(
    key: string,
    values: Partial<Problem> = {},
    private db: DbService
  ) {
    this._key = key;
    this._created = new Date();
    this._modified = new Date();
    this._setDefaults();
    this._setValues(values);
    console.log("new problem created", this.db);
  }

  public save() {
    this._modified = new Date();
    return this.db.afs.doc(`problems/${this._key}`).set(this.values());
  }
  public delete() {
    console.log("deleting problem");
  }
  // when getting values want only properties that are value and not methods or db
  public values() {
    const v: Partial<Problem> = {};
    Object.getOwnPropertyNames(this).forEach(key => {
      if (key !== "db") {
        v[key] = this[key];
      }
    });
    console.log("v", v);
    return v;
  }

  setSlug(title: string) {
    this.slug = this._stripSpecialCharacters(title);
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
      pedagogy: null,
      downloadUrl: null
    };
    this.difficulty = "easy";
    this.isApproved = false;
    this.createdBy = null;
  }

  private _setValues(values: Partial<Problem>) {
    if (values) {
      Object.getOwnPropertyNames(values).forEach(k => {
        this[k] = values[k];
      });
    }
  }

  private _stripSpecialCharacters(text: string) {
    return text
      .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, "")
      .toLowerCase()
      .split(" ")
      .join("-");
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
  downloadUrl: string;
}

interface IStudentVersion {
  content: string;
  images: IUploadedFileMeta[];
}
