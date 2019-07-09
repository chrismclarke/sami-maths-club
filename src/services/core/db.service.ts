import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
// note, should check if still can build production with this
import { firestore } from "firebase/app";
import { IDBEndpoint, ITimestamp, IDBDoc } from "src/models/common.model";

@Injectable({
  providedIn: "root"
})
export class DbService {
  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {}
  // *** NOTE, REQUIRES _modified FIELD ON ALL DOCS TO FUNCTION PROPERLY
  getCollection(endpoint: IDBEndpoint, startDoc?: IDBDoc) {
    // having query issues with timestamps so just converting to date
    const start = startDoc
      ? this._timestampToDate(startDoc._modified)
      : new Date(0);
    console.log(`get [${endpoint}] collection after [${start}]`);
    const results$ = new Observable<any[]>(subscriber => {
      this.afs.firestore
        .collection(endpoint)
        .orderBy("_modified", "asc")
        .where("_modified", ">", start)
        // startafter not working (need to get doc via query first and don't want to make async)
        // so using where instead (unlikely duplicate _modified dates)
        .onSnapshot(
          // emit if only server/cache changes to ensure we receive server updates
          { includeMetadataChanges: true },
          docs => {
            if (!docs.metadata.fromCache) {
              if (!docs.empty) {
                const data = docs.docs.map(d => d.data());
                console.log("server update received", data);
                subscriber.next(data);
              } else {
                console.log(`[${endpoint}] up to date`);
              }
            } else {
              console.log("cache update received");
            }
          },
          err => {
            console.error(`could not get [${endpoint}] after [${start}]`);
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
    limit: number = 1000
  ) {
    console.log(`query [${endpoint}] collection`);
    const ref = this.afs.firestore.collection(endpoint).limit(limit);
    const query = ref.where(field, operator, value);
    // use try-catch as firebase throws error if cache does not have doc
    try {
      const queryDocs = await query.get({ source: "cache" });
      if (queryDocs.empty) {
        const serverDocs = await query.get({ source: "server" });
        return serverDocs.docs.map(d => d.data());
      }
      return queryDocs.docs.map(d => d.data());
    } catch (error) {
      const serverDocs = await query.get({ source: "server" });
      return serverDocs.docs.map(d => d.data());
    }
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
    try {
      const user = this.auth.auth.currentUser;
      this.afs
        .doc(`${collection}/${doc._key}`)
        .set(doc)
        .catch(err => {
          throw err;
        });
      console.log(`[${collection}/${doc._key}] set success`);
    } catch (error) {
      console.log(`[${collection}/${doc._key}] set fail`);
      throw error;
    }
  }
  // used for retrieving user profiles, by default returns cached first and checks for update silently
  async getDoc(collection: IDBEndpoint, key: string): Promise<IDBDoc> {
    console.log(`get [${collection}/${key}] doc`);
    const ref = this.afs.doc(`${collection}/${key}`);
    // use try-catch as firebase throws error if doc does not exist in cache
    try {
      const cached = await ref.get({ source: "cache" }).toPromise();
      if (cached) {
        // check for update, but still return cached while executing
        ref.get({ source: "cache" }).toPromise();
        return cached.data() as IDBDoc;
      } else {
        const live = await ref.get({ source: "server" }).toPromise();
        return live.data() as IDBDoc;
      }
    } catch (error) {
      const live = await ref.get({ source: "server" }).toPromise();
      return live.data() as IDBDoc;
    }
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

  private _timestampToDate(t: ITimestamp = { seconds: 0, nanoseconds: 0 }) {
    const timestamp = new firestore.Timestamp(t.seconds, t.nanoseconds);
    return timestamp.toDate();
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
