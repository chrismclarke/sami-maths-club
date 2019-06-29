import { Injectable } from "@angular/core";
import { DbService, StorageService } from "src/services";
import {
  Problem,
  IProblem,
  PROBLEM_API_VERSION
} from "src/models/problem.model";
import { BehaviorSubject } from "rxjs";
import { ITimestamp, IUploadedFileMeta } from "src/models/common.model";
import { INITIAL_PROBLEMS } from "src/assets/data/initialProblems";
import { environment } from "src/environments/environment";
import { mergeJsonArrays } from "src/utils/utils";

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
    const cached: ICachedProblems = await this.storageService.getObject(
      "problemsV1"
    );
    if (cached) {
      const problems: IProblem[] = Object.values(cached);
      this.problems.next(this._filterProblems(problems));
      const latest = problems[problems.length - 1];
      return this._subscribeToProblemUpdates(latest);
    } else {
      // native load hardcoded problems
      if (environment.isAndroid) {
        await this.loadHardcodedProblems(INITIAL_PROBLEMS);
        return this.init();
      }
      // web subscribe to all
      return this._subscribeToProblemUpdates();
    }
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
    console.log("getting new problems", startAfter);
    this.db.getCollection("problemsV1", startAfter).subscribe(
      async data => {
        const newProblems = data as IProblem[];
        const total = newProblems.length;
        console.log(
          `%c Downloading [${newProblems.length}] New Problems!!!`,
          "background: #222; color: #bada55"
        );
        let count = 1;
        for (const problem of newProblems) {
          // cache problem
          console.log(`caching ${count} of ${total}`);
          await this.storageService.addFilesToCache(
            problem.studentVersion.images
          );
          count++;
          // merge
          // notify (?)
          // update cache
        }

        const merged = mergeJsonArrays(this.problems.value, data as IProblem[]);
        this.problems.next(this._filterProblems(merged));
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
  async loadHardcodedProblems(problems: IProblem[]) {
    const cached: ICachedProblems = {};
    // save problems in sequence to avoid file system conflict
    for (const problem of problems.slice(0, 1)) {
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
