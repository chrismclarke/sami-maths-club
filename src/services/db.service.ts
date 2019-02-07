import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DbService {
  // *** note, should make this private and force use of own methods instead
  // own methods should populate meta keys and timestamps
  constructor(public afs: AngularFirestore) {}

  // collection query for AFS - first queries offline cached data, then runs server query to fetch only newer docs
  // updates pushed to observable
  // details on approach here:  https://firebase.google.com/docs/firestore/manage-data/enable-offline
  //                            https://groups.google.com/forum/#!topic/google-cloud-firestore-discuss/A7vMrtmV4U8
  //
  // *** NOTE, REQUIRES _modified FIELD ON ALL DOCS TO FUNCTION PROPERLY
  getCollection(endpoint: string) {
    const results$ = new Observable<any[]>(subscriber => {
      this.getAfsCached(endpoint).then(records => {
        const cached = records.docs.map(d => d.data());
        subscriber.next(cached);
        this.afs.firestore
          .collection(endpoint)
          // have to provide a orderBy sort field if want to use startAt
          .orderBy("_modified")
          // if cached doc start after latest from cache, otherwise start from beginning (index > -1)
          .startAfter(records.size > 0 ? records.docs[records.size - 1] : -1)
          .onSnapshot(
            docs => {
              console.log("snapshot received", docs.size);
              if (!docs.empty) {
                const update = docs.docs.map(d => d.data());
                subscriber.next(this.mergeData(cached, update));
              }
            },
            err => console.log("err", err),
            () => console.log("complete")
          );
      });
    });
    return results$;
  }

  private async getAfsCached(endpoint: string) {
    const docs = await this.afs.firestore
      .collection(endpoint)
      .orderBy("_modified")
      .get({ source: "cache" });
    return docs;
  }

  // merge two object arrays by '_key' field
  private mergeData(oldDocs: any[], newDocs: any[]) {
    const json = {};
    oldDocs.forEach(d => {
      json[d._key] = d;
    });
    newDocs.forEach(d => {
      json[d._key] = d;
    });
    return Object.values(json);
  }

  // merge
  // snapshot could contain doc already cached in which case need to overwrite

  // process
  /*

    when snapshot comes in should populate _key field from snapshot

  */
}
