import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { IUploadedFileMeta } from "src/models/common.model";

@Injectable({
  providedIn: "root"
})
export class WebStorageService extends StorageBase implements IStorageService {
  constructor(public server: AngularFireStorage, storage: Storage) {
    super(storage);
    console.log("[Web] storage service");
  }

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
}
