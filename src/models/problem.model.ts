import { SafeHtml } from "@angular/platform-browser";
import { IUploadedFileMeta, ITimestamp } from "./common.model";

export const PROBLEM_API_VERSION = 1.0;
export type ProblemEndoint = "problemsV1";
export class Problem {
  // call constructor with optional values to populate

  constructor(public values: IProblem) {
    console.log("load problem", values);
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
  pdf?: IUploadedFileMeta;
  // todo - remove download url and add full meta
  downloadUrl?: string;
  extension?: null;
  pedagogy?: null;
  solution?: null;
}

interface IStudentVersion {
  content: string;
  images: IUploadedFileMeta[];
}
