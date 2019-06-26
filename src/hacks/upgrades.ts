import { IProblem } from "src/models/problem.model";

// TEMP METHOD used to upgrade from v0 to v1
function upgradeProblemsV0() {
  this.db.getCollection("problems").subscribe(problems => {
    console.log("upgrade problems", problems);
    if (problems.length === 14) {
      setTimeout(() => {
        problems = problems.map(p => {
          p._apiVersion = p._apiVersion ? p._apiVersion : 1.0;
          p.createdBy = p.createdBy ? p.createdBy : "SAMI";
          if (p.hasOwnProperty("_completedBy")) {
            delete p["_completedBy"];
          }
          p.locked = p.locked ? p.locked : false;
          return p;
        });
        console.log("problems", problems);
        problems.forEach(async (p: IProblem) => {
          await this.db.afs.doc(`problemsV1/${p._key}`).set(p);
        });
      }, 5000);
    }
  });
}
