import { DbService } from "src/services/core/db.service";
import { SafeHtml } from "@angular/platform-browser";
import { IUploadedFileMeta, ITimestamp } from "./common.model";

export const PROBLEM_API_VERSION = 1.0;
export type ProblemEndoint = "problemsV1";
export class Problem {
  // call constructor with optional values to populate
  // NOTE - we want to instantiate 'new' problems but will still need to pass the shared dbService (save creating a new one)

  constructor(public values: IProblem, private db: DbService) {
    console.log("load problem", values);
  }

  public save() {
    this.db.setDoc("problemsV1", this.values);
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
  _averageRating?: number;
  _apiVersion: number;
  _created: ITimestamp;
  _modified: ITimestamp;
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
