import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { DbService } from "./db.service";
import { Problem, IProblem } from "src/models/problems.model";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root"
})
export class ProblemService {
  public problems: IProblem[] = [];
  constructor(private db: DbService, private storage: StorageService) {}

  // load problems from local cache and subscribe to updates from server
  async init() {
    const p = await this.storage.local.get("storage");
    console.log("p", p);
  }

  // query for matching slug, only want to take first result (don't expect db to change)
  async getProblemBySlug(slug: string) {
    const ref = this.db.afs.collection<IProblem>(`problems`, r =>
      r.where("slug", "==", slug)
    );
    const results = await ref
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    return results[0];
  }

  generateNewProblem() {
    const key = this.db.afs.createId();
    const problem = new Problem(key);
    console.log("problem", problem);
    return problem;
  }
}
