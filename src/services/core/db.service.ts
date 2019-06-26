import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
// note, should check if still can build production with this
import { firestore } from "firebase/app";
import { IDBEndpoint } from "src/models/common.model";

@Injectable({
  providedIn: "root"
})
export class DbService {
  // *** note, should make this private and force use of own methods instead
  // own methods should populate meta keys and timestamps
  constructor(public afs: AngularFirestore) {}

  // collection query for AFS - first queries offline cached data, then runs server query to fetch only newer docs
  // updates pushed to observable. details on approach here:
  // https://firebase.google.com/docs/firestore/manage-data/enable-offline
  // https://groups.google.com/forum/#!topic/google-cloud-firestore-discuss/A7vMrtmV4U8

  // *** NOTE, REQUIRES _modified FIELD ON ALL DOCS TO FUNCTION PROPERLY
  getCollection(endpoint: IDBEndpoint) {
    const results$ = new Observable<any[]>(subscriber => {
      this.getAfsCachedCollection(endpoint).then(records => {
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
            err => {
              throw new Error(`could not get endpoint: ${endpoint}`);
            }
          );
      });
    });
    return results$;
  }

  // use firestore querystring to fetch doc. First check cache and return if found, otherwise check live
  async queryCollection(
    endpoint: IDBEndpoint,
    field: string,
    operator: firestore.WhereFilterOp,
    value: any,
    orderBy: string = "modified",
    limit: number = 1000
  ) {
    const ref = this.afs.firestore
      .collection(endpoint)
      .orderBy(orderBy)
      .limit(limit);
    const query = ref.where(field, operator, value);
    let res = await query.get({ source: "cache" });
    if (res.empty) {
      res = await query.get({ source: "server" });
    }
    return res.docs.map(d => d.data());
  }

  private async getAfsCachedCollection(endpoint: IDBEndpoint) {
    const docs = await this.afs.firestore
      .collection(endpoint)
      .orderBy("_modified")
      .get({ source: "cache" });
    return docs;
  }

  generateTimestamp(date: Date) {
    return firestore.Timestamp.fromDate(date);
  }

  // not currently implemented, but may want some method to ensure cached data not stale
  // e.g. case when problem edited or deleted and _modified field not changed
  private async refreshCache(endpoint: IDBEndpoint) {
    const docs = await this.afs.firestore
      .collection(endpoint)
      .orderBy("_modified")
      .get({ source: "server" });
    return docs;
  }

  // currently no easy method to do this with firebase, would have to disable persistance at start
  private async deleteCache() {}

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
  *** NOTE - MAY WANT TO ADD FILTERS for deleted etc

  */
}
