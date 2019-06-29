import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
// note, should check if still can build production with this
import { firestore } from "firebase/app";
import { IDBEndpoint, ITimestamp, IDBDoc } from "src/models/common.model";

@Injectable({
  providedIn: "root"
})
export class DbService {
  // *** note, should make this private and force use of own methods instead
  // own methods should populate meta keys and timestamps
  constructor(private afs: AngularFirestore) {}

  // *** NOTE, REQUIRES _modified FIELD ON ALL DOCS TO FUNCTION PROPERLY
  getCollection(endpoint: IDBEndpoint, startAfter?: IDBDoc) {
    console.log("getting collection", endpoint, "after", startAfter);
    const results$ = new Observable<any[]>(subscriber => {
      this.afs.firestore
        .collection(endpoint)
        // have to provide a orderBy sort field if want to use startAt
        .orderBy("_modified", "desc")
        // if cached doc start after latest from cache, otherwise start from beginning (index > -1)
        .startAfter(startAfter ? startAfter : -1)
        .onSnapshot(
          docs => {
            console.log("snapshot received", docs.size);
            if (!docs.empty) {
              const data = docs.docs.map(d => d.data());
              subscriber.next(data);
            }
          },
          err => {
            console.error(`could not get endpoint: ${endpoint}`);
            throw err;
          }
        );
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

  /**************************************************************************
   *  Doc Methods
   *************************************************************************/
  async setDoc(collection: IDBEndpoint, value: any) {
    const meta = this.generateDocMeta(value);
    const doc: IDBDoc = {
      ...value,
      ...meta
    };
    return this.afs.doc(`${collection}/${doc._key}`).set(doc);
  }
  async getDoc(collection: IDBEndpoint, key: string): Promise<IDBDoc> {
    const d = await this.afs
      .doc(`${collection}/${key}`)
      .get()
      .toPromise();
    return d.data() as IDBDoc;
  }

  /**************************************************************************
   *  Generators
   *************************************************************************/
  generateTimestamp(date: Date) {
    return firestore.Timestamp.fromDate(date);
  }
  generateID() {
    return this.afs.createId();
  }
  // generate standard set of doc meta, optionally pulling values from existing
  generateDocMeta(d: Partial<IDBDoc> = {}): IDBDoc {
    return {
      _created: d._created ? d._created : this.generateTimestamp(new Date()),
      _modified: this.generateTimestamp(new Date()),
      _key: d._key ? d._key : this.generateID()
    };
  }

  /**************************************************************************
   *  Housekeeping
   *************************************************************************/

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

  // merge
  // snapshot could contain doc already cached in which case need to overwrite

  // process
  /*
  *** NOTE - MAY WANT TO ADD FILTERS for deleted etc

  */
}
