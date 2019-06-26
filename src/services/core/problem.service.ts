import { Injectable } from "@angular/core";
import { DbService, StorageService } from "src/services";
import {
  Problem,
  IProblem,
  PROBLEM_API_VERSION
} from "src/models/problem.model";
import { BehaviorSubject } from "rxjs";
import { DEFAULT_PROBLEMS } from "src/data/defaultProblems";

@Injectable({
  providedIn: "root"
})
export class ProblemService {
  // initiate problems as behaviorSubject so that changes can be observed and accessed
  // during late subsription, as well as directly synchronously
  public problems = new BehaviorSubject<IProblem[]>([]);
  constructor(private db: DbService, private storageService: StorageService) {
    this.init();
  }

  /********************************************************************************
   * Initialisation
   ********************************************************************************/

  private async init() {
    // get local cache problems
    const cached = await this.storageService.get("problemsV1");
    if (!cached) {
      return this.loadHardcodedProblems();
    }
    this.problems.next(JSON.parse(cached));
    this._subscribeToProblemUpdates();
  }

  /********************************************************************************
   *  Public methods
   ********************************************************************************/

  // query for matching slug, only want to take first result (don't expect db to change)
  // as may be direct navigation first ensure db loaded before querying
  // returns Problem with undefined values if match not made
  public async getProblemBySlug(slug: string) {
    const results = (await this.db.queryCollection(
      "problemsV1",
      "slug",
      "==",
      slug
    )) as IProblem[];
    return new Problem(results[0], this.db);
  }

  public generateNewProblem(userID: string) {
    const values: IProblem = {
      // tslint:disable-next-line:no-use-before-declare
      ...PROBLEM_DEFAULTS,
      _modified: this.db.generateTimestamp(new Date()),
      _created: this.db.generateTimestamp(new Date()),
      _key: this.db.afs.createId(),
      createdBy: userID
    };
    return new Problem(values, this.db);
  }

  /********************************************************************************
   *  Private methods
   ********************************************************************************/
  // for very first init a subset of problems are readily available
  private loadHardcodedProblems() {
    console.log("initialising problems for the first time");
  }
  private async _subscribeToProblemUpdates() {
    this.db.getCollection("problemsV1").subscribe(
      data => {
        // this.problems.next(data);
        console.log("problems", data);
      },
      err => {
        throw new Error("could not get problems");
      }
    );
  }

  /********************************************************************************
   *  Methods used only on-demand (e.g. preparing new release hard-coded resources)
   ********************************************************************************/
  private async generateHardcodedProblems() {
    // use query, requires some default query params to alllow order and limit
    const promises = DEFAULT_PROBLEMS.map(p => {
      // await;
    });
  }
  private copyProblemImages(problem: IProblem) {
    problem.studentVersion.images.forEach(imageMeta => {
      // this.storageService;
    });
  }
}

const PROBLEM_DEFAULTS = {
  _apiVersion: PROBLEM_API_VERSION,
  _averageRating: null,
  _key: null,
  coverSVG: null,
  createdBy: null,
  difficulty: null,
  facilitatorVersion: {
    solution: null,
    extension: null,
    pedagogy: null,
    downloadUrl: null
  },
  isApproved: false,
  locked: false,
  slug: null,
  studentVersion: { content: null, images: [] },
  title: null
};
