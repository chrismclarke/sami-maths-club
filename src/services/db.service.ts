import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { storage } from "firebase";

@Injectable({
  providedIn: "root"
})
export class DbService {
  constructor(
    public afs: AngularFirestore,
    public fireStorage: AngularFireStorage
  ) {
    console.log("db service constructor", afs);
  }

  /******************************************************************************************
                                Storage Functions
  /*****************************************************************************************/
  // on file upload also generate download link and populate file meta
  async uploadFile(path: string, blob: Blob) {
    const upload = await this.fireStorage.ref(path).put(blob);
    const downloadUrl = await this.fireStorage
      .ref(path)
      .getDownloadURL()
      .toPromise();
    return {
      ...this._getUploadMetaSubset(upload.metadata),
      downloadUrl: downloadUrl
    };
  }

  // some default upload meta can be undefined which can throw errors when setting in the db
  // this method provides a subset which will be defined
  private _getUploadMetaSubset(meta: storage.FullMetadata) {
    return (({
      bucket,
      contentType,
      fullPath,
      name,
      size,
      timeCreated,
      updated
    }) => ({
      bucket,
      contentType,
      fullPath,
      name,
      size,
      timeCreated,
      updated
    }))(meta);
  }
}

// NOTE - could force offline-first approach with
// https://firebase.google.com/docs/firestore/manage-data/enable-offline
