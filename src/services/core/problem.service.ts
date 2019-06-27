import { Injectable } from "@angular/core";
import { DbService, StorageService } from "src/services";
import {
  Problem,
  IProblem,
  PROBLEM_API_VERSION
} from "src/models/problem.model";
import { BehaviorSubject } from "rxjs";
import { ITimestamp } from "src/models/common.model";
import { INITIAL_PROBLEMS } from "src/data/initialProblems";
import { environment } from "src/environments/environment";

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
      // if not cached
      await this.loadHardcodedProblems();
      // return this.init();
    }
    // cached data stored in {key:value} format for each problem
    const cachedData: { [key: string]: IProblem } = JSON.parse(cached);
    const problems: IProblem[] = Object.values(cachedData);
    this.problems.next(problems);
    const latest = problems[problems.length - 1];
    this._subscribeToProblemUpdates(latest._modified);
  }

  // for very first init a subset of problems are readily available
  async loadHardcodedProblems() {
    if (environment.isAndroid) {
      await this.storageService.copyAppFolder("data/uploads");
    }

    INITIAL_PROBLEMS.forEach(problem => {});
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

  private async _subscribeToProblemUpdates(startAfter: ITimestamp) {
    this.db.getCollection("problemsV1", startAfter).subscribe(
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
