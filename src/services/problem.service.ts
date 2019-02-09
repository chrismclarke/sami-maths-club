import { Injectable } from "@angular/core";
import { DbService } from "./db.service";
import {
  Problem,
  IProblem,
  PROBLEM_API_VERSION
} from "src/models/problem.model";
// import { MOCK_PROBLEMS } from "src/mocks/problems.mock";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProblemService {
  // initiate problems as behaviorSubject so that changes can be observed and accessed
  // during late subsription, as well as directly synchronously
  public problems = new BehaviorSubject<IProblem[]>([]);
  private initialised = new BehaviorSubject<boolean>(false);
  constructor(private db: DbService) {
    this.init();
  }

  // load problems from local cache and subscribe to updates from server
  async init() {
    this.db.getCollection("problems").subscribe(data => {
      this.problems.next(data);
      this.initialised.next(true);
    });
  }

  // query for matching slug, only want to take first result (don't expect db to change)
  // as may be direct navigation first ensure db loaded before querying
  // returns Problem with undefined values if match not made
  async getProblemBySlug(slug: string) {
    const results = (await this.db.queryCollection(
      "problems",
      "slug",
      "==",
      slug
    )) as IProblem[];
    return new Problem(results[0], this.db);
  }

  // private loadMockProblems() {
  //   this.problems.next(MOCK_PROBLEMS(20, this.db));
  // }
}

const PROBLEM_DEFAULTS: IProblem = {
  _apiVersion: PROBLEM_API_VERSION,
  _averageRating: null,
  _completedBy: {},
  _created: new Date(),
  _key: null,
  _modified: new Date(),
  coverSVG: null,
  createdBy: null,
  difficulty: null,
  facilitatorVersion: null,
  isApproved: false,
  locked: false,
  slug: null,
  studentVersion: null,
  title: null
};
