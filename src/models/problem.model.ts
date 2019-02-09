import { DbService } from "src/services/db.service";
import { IUploadedFileMeta } from "src/services/storage.service";
import { SafeHtml } from "@angular/platform-browser";

export const PROBLEM_API_VERSION = 1.0;
export class Problem {
  // call constructor with optional values to populate
  // NOTE - we want to instantiate 'new' problems but will still need to pass the shared dbService (save creating a new one)

  constructor(public values: IProblem, private db: DbService) {}

  public save() {
    this.values._modified = new Date();
    return this.db.afs.doc(`problems/${this.values._key}`).set(this.values);
  }
  public delete() {
    console.log("deleting problem");
  }

  setSlug(title: string) {
    this.values.slug = this._stripSpecialCharacters(title);
  }

  private _stripSpecialCharacters(text: string) {
    return text
      .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, "")
      .toLowerCase()
      .split(" ")
      .join("-");
  }
}

/****************************************
 *  Interfaces
 * **************************************/
// properties assigned during creation
export interface IProblem {
  _averageRating: number;
  _apiVersion: number;
  _completedBy: { ["id"]?: boolean };
  _created: Date;
  _modified: Date;
  _key: string;
  title: string;
  slug: string;
  createdBy: string;
  isApproved: boolean;
  coverSVG: string | SafeHtml;
  studentVersion: IStudentVersion;
  facilitatorVersion: IFacilitatorVersion;
  locked: boolean;
  difficulty: "easy" | "medium" | "hard";
  deleted?: boolean;
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
