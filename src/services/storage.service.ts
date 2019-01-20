import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AngularFireStorage } from "@angular/fire/storage";
import { storage } from "firebase/storage";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  constructor(public local: Storage, public server: AngularFireStorage) {}

  /******************************************************************************************
                                Storage Functions
  /*****************************************************************************************/
  // on file upload also generate download link and populate file meta
  async uploadFile(path: string, blob: Blob) {
    const upload = await this.server.ref(path).put(blob);
    const downloadUrl = await this.server
      .ref(path)
      .getDownloadURL()
      .toPromise();
    const meta: IUploadedFileMeta = {
      ...this._getUploadMetaSubset(upload.metadata),
      downloadUrl: downloadUrl
    };
    return meta;
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

/******************************************************************************************
                                Interfaces
  /*****************************************************************************************/
export interface IUploadedFileMeta extends Partial<storage.FullMetadata> {
  downloadUrl: string;
  bucket: string;
  contentType: string;
  fullPath: string;
  name: string;
  size: number;
  timeCreated: string;
  updated: string;
}
