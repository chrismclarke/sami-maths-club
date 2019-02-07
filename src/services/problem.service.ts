import { Injectable } from "@angular/core";
import { DbService } from "./db.service";
import { Problem, IProblem } from "src/models/problem.model";
import { StorageService } from "./storage.service";
import { MOCK_PROBLEMS } from "src/mocks/problems.mock";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ProblemService {
  // initiate problems as behaviorSubject so that changes can be observed and accessed
  // during late subsription, as well as directly synchronously
  public problems = new BehaviorSubject<IProblem[]>([]);
  private initialised = new BehaviorSubject<boolean>(false);
  private activeProblem: IProblem;
  constructor(
    private db: DbService,
    // private storage: StorageService,
    private router: Router
  ) {
    this.init();
  }

  // load problems from local cache and subscribe to updates from server
  async init() {
    // await this.loadProblemsFromCache();
    // await this.syncUpdates();

    // console.log("getting collection");
    this.db.getCollection("problems").subscribe(data => {
      console.log("data received", data);
      this.problems.next(data);
      this.initialised.next(true);
    });
  }

  // async syncUpdates() {
  //   const latestProblem = this.problems.value[0];
  //   const lastUpdate = latestProblem
  //     ? new Date(latestProblem._modified.seconds)
  //     : new Date(0);
  //   // use unwrapped version to provide full access to onSnapshot (valueChanges emits all docs each time, not just changes)
  //   this.db.afs.firestore
  //     .collection("problems")
  //     .where("_modified", ">", lastUpdate)
  //     .onSnapshot(async snapshot => {
  //       const update = snapshot.docs.map(doc => doc.data() as IProblem);
  //       await this.updateCache(update);
  //       await this.loadProblemsFromCache();
  //     });
  // }

  // // cache stores json id:problem format so retrieve and convert to array
  // async loadProblemsFromCache() {
  //   const problemsJson = await this.storage.local.get("problems");
  //   const problems = problemsJson
  //     ? (Object.values(problemsJson) as IProblem[])
  //     : [];
  //   this.problems.next(this._sortProblems(problems));
  // }
  // _sortProblems(jsonArray: IProblem[]) {
  //   const sorted = [...jsonArray].sort((a, b) => {
  //     return a._created.seconds > b._created.seconds ? 1 : -1;
  //   });
  //   return sorted;
  // }

  // // update cache json to reflect all existing problems and any new ones
  // async updateCache(newProblems: IProblem[] = []) {
  //   const problemsJson = {};
  //   const allProblems = [...this.problems.value, ...newProblems];
  //   allProblems.forEach(p => {
  //     problemsJson[p._key] = p;
  //   });
  //   await this.storage.local.set("problems", problemsJson);
  // }

  // query for matching slug, only want to take first result (don't expect db to change)
  // as may be direct navigation first ensure db loaded before querying
  async getProblemBySlug(slug: string) {
    // if problem has just been created and redirect triggered quickly return
    if (this.activeProblem && this.activeProblem.slug === slug) {
      return this.activeProblem;
    }
    await this._waitUntilInitComplete();
    const cached = this.problems.value.filter(p => {
      return p.slug === slug;
    });
    if (cached[0]) {
      return this.generateProblem(cached[0]);
    } else {
      const ref = this.db.afs.collection<IProblem>(`problems`, r =>
        r.where("slug", "==", slug)
      );
      const live = await ref.get().toPromise();
      if (live.empty) {
        await this.router.navigate(["/problems"]);
      } else {
        const problemData = live.empty ? { _key: null } : live.docs[0].data();
        return this.generateProblem(problemData);
      }
    }
  }
  async _waitUntilInitComplete() {
    return new Promise(resolve => {
      if (this.initialised.value === true) {
        resolve();
      } else {
        this.initialised.subscribe(status => {
          if (status === true) {
            resolve();
          }
        });
      }
    });
  }

  // take set of problem values (or null) and generate a corresponding problem class
  // also bind to active problem so can be matched quickly if returning via slug
  generateProblem(problemValues?: Partial<IProblem>) {
    if (!problemValues) {
      problemValues = { _key: this.db.afs.createId() };
    }
    this.activeProblem = new Problem(
      problemValues._key,
      problemValues,
      this.db
    );
    return this.activeProblem;
  }

  private loadMockProblems() {
    this.problems.next(MOCK_PROBLEMS(20, this.db));
  }
}
