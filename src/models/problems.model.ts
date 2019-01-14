export class Problem {
  readonly _key: string;
  readonly _created: Date;
  _modified: Date;
  title: string;
  slug: string;
  studentVersion: string;
  facilitatorVersion: IProblemFacilitatorVersion;
  constructor(key: string) {
    console.log("new problem initialised");
    this._key = key;
    this._created = new Date();
    this._modified = new Date();
    this.title = null;
    this.slug = null;
    this.studentVersion = null;
    this.facilitatorVersion = {
      solution: null,
      extension: null,
      pedagogy: null
    };
  }
  public save() {
    console.log("saving problem");
  }
  public delete() {
    console.log("deleting problem");
  }
}

export interface IProblem extends Problem {
  _completedBy?: { ["id"]: boolean };
  _averageRating?: number;
}

interface IProblemFacilitatorVersion {
  solution: string;
  extension: string;
  pedagogy: string;
}
