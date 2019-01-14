import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { DbService } from "./db.service";
import { Problem, IProblem } from "src/models/problems.model";

@Injectable({
  providedIn: "root"
})
export class ProblemService {
  constructor(private db: DbService) {}

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
