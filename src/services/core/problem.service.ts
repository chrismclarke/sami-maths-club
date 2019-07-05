import { Injectable } from "@angular/core";
import { DbService, StorageService } from "src/services";
import {
  Problem,
  IProblem,
  PROBLEM_API_VERSION
} from "src/models/problem.model";
import { BehaviorSubject } from "rxjs";
import { IUploadedFileMeta } from "src/models/common.model";
import { INITIAL_PROBLEMS } from "src/assets/data/initialProblems";
import { environment } from "src/environments";

interface ICachedProblems {
  [key: string]: IProblem;
}
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
    const cached = await this.getCachedProblems();
    if (Object.keys(cached).length > 0) {
      console.log(`[${Object.keys(cached).length}] cached problems found`);
      this.emitCachedProblems(cached);
      const latest = this.problems.value[0];
      return this._subscribeToProblemUpdates(latest);
    } else {
      // native load hardcoded problems
      if (environment.isAndroid) {
        console.log("loading hardcoded problems");
        await this.loadHardcodedProblems();
        return this.init();
      }
      // web subscribe to all
      return this._subscribeToProblemUpdates();
    }
  }

  private async getCachedProblems(): Promise<ICachedProblems> {
    const cached = await this.storageService.getObject("problemsV1");
    return { ...cached } as ICachedProblems;
  }

  // sort, filter and update problems behaviour subject from cached data
  private emitCachedProblems(cached: ICachedProblems) {
    const problems: IProblem[] = Object.values(cached);
    this.problems.next(this._filterProblems(problems));
  }

  /********************************************************************************
   *  Public methods
   ********************************************************************************/

  // query for matching slug, only want to take first result (don't expect db to change)
  // as may be direct navigation first ensure db loaded before querying
  // returns Problem with undefined values if match not made
  public async getProblemBySlug(slug: string) {
    // see if exists locally first
    let problem = this.problems.value.find(p => p.slug === slug);
    if (!problem) {
      // if not use db to search
      const results = (await this.db.queryCollection(
        "problemsV1",
        "slug",
        "==",
        slug
      )) as IProblem[];
      problem = results[0];
    }

    return new Problem(problem, this.db);
  }

  public generateNewProblem(userID: string) {
    const values: IProblem = {
      // tslint:disable-next-line:no-use-before-declare
      ...PROBLEM_DEFAULTS,
      _modified: this.db.generateTimestamp(new Date()),
      _created: this.db.generateTimestamp(new Date()),
      _key: this.db.generateID(),
      createdBy: userID
    };
    return new Problem(values, this.db);
  }

  /********************************************************************************
   *  Private methods
   ********************************************************************************/

  //  take newest doc in cache and look for anything newer
  //  when fresh data arrives ensure images are stored locally before making available
  //  and finally update local cache
  private async _subscribeToProblemUpdates(startAfter?: IProblem) {
    this.db.getCollection("problemsV1", startAfter).subscribe(
      async data => {
        const newProblems = data as IProblem[];
        console.log(
          `%c Downloading [${newProblems.length}] New Problems!!!`,
          "background: #222; color: #bada55"
        );
        let count = 1;
        for (const problem of newProblems) {
          // cache problem
          await this.storageService.addFilesToCache(
            problem.studentVersion.images
          );
          count++;
          // merge
          const cached = await this.getCachedProblems();
          cached[problem._key] = problem;
          // notify (?)
          // update cache
          await this.storageService.set("problemsV1", JSON.stringify(cached));
          this.emitCachedProblems(cached);
        }
        console.log("problems", this.problems.value);
      },
      err => {
        throw new Error("could not get problems");
      }
    );
  }

  private _filterProblems(problems: IProblem[]) {
    let p = [...problems];
    // remove deleted
    p = p.filter(v => !v.deleted);
    // hide temp from non-admin or non-creator

    // sort by created
    const sorted = p.sort((a, b) => {
      return a._created > b._created ? 1 : -1;
    });
    return sorted;
  }

  /********************************************************************************
   *  Methods used only on-demand - Hardcoded problems
   ********************************************************************************/
  // for very first init a subset of problems are readily available
  async loadHardcodedProblems() {
    const cached: ICachedProblems = {};
    // save problems in sequence to avoid file system conflict
    // currently only 1 problem ready
    for (const problem of INITIAL_PROBLEMS.slice(0, 1)) {
      await this.copyHardCodedImages(problem.studentVersion.images);
      cached[problem._key] = problem;
    }
    await this.storageService.set("problemsV1", JSON.stringify(cached));
  }

  async copyHardCodedImages(images: IUploadedFileMeta[]) {
    const promises = images.map(async image => {
      try {
        await this.storageService.copyAppAsset(image);
      } catch (error) {
        // File could not be copied, does not exist in assets folder
        throw Error;
      }
    });
    return Promise.all(promises);
  }
}

// use any type instead of Partial<IProblem> as all fields below required
const PROBLEM_DEFAULTS: any = {
  _apiVersion: PROBLEM_API_VERSION,
  _averageRating: null,
  _key: null,
  coverSVG: null,
  createdBy: null,
  difficulty: null,
  facilitatorVersion: {},
  isApproved: false,
  locked: false,
  slug: null,
  studentVersion: { content: null, images: [] },
  title: null
};
