import {
  IUploadedFileMeta,
  FullMetadata,
  IDBEndpoint
} from "src/models/common.model";
import { Plugins, StoragePlugin } from "@capacitor/core";
import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
const { Storage } = Plugins;

/* storage class handles both local (indexedDB) cache storage as well as
 * file caching
 */

/************************************************************************
 * Interface
 ************************************************************************/
// methods implemented same for all
interface IStorageServiceBase {
  localStorage: StoragePlugin;
  serverStorage: AngularFireStorage;
  get(cacheKey: IDBEndpoint): Promise<string | null>;
  set(cacheKey: IDBEndpoint, value: any): Promise<void>;
  uploadFile(path: string, blob: Blob): Promise<IUploadedFileMeta>;
  _getUploadMetaSubset(meta: FullMetadata): Partial<IUploadedFileMeta>;
}
// methods that vary by pwa/native implementation
export interface IStorageService extends IStorageServiceBase {
  // support multiple files to be cached at same time so can send single fail notice
  // and allow optimsed cache add on web (not repeatedly opening and adding one file)
  addFilesToCache(files: IUploadedFileMeta[]): Promise<void>;
  // specifically for native, allow assets to be copied from app folder itself
  // to allow core assets to be used throughout app (e.g. hardcoded problems)
  copyAppAsset(file: IUploadedFileMeta): Promise<void>;
  // native method to return the uri of a cached file to display in img tag
  getCachedFileURI(file: IUploadedFileMeta): Promise<string>;
}

/************************************************************************
 * Base class
 ************************************************************************/
@Injectable({
  providedIn: "root"
})
export class StorageBase implements IStorageServiceBase {
  public localStorage: StoragePlugin;
  constructor(public serverStorage: AngularFireStorage) {
    this.localStorage = Storage;
    console.log("[Base] storage service");
  }

  /******************************************************************************************
                               Local File Storage Functions
                               (most done via native/pwa extension)
  /*****************************************************************************************/

  /******************************************************************************************
                               Local DB Storage Functions
  /*****************************************************************************************/

  async get(key: IDBEndpoint): Promise<string | null> {
    const ret = await this.localStorage.get({ key: key });
    return ret.value;
  }
  async set(key: IDBEndpoint, value: string): Promise<void> {
    return this.localStorage.set({ key: key, value: JSON.stringify(value) });
  }
  async getObject(key: IDBEndpoint): Promise<any> {
    const ret = await this.localStorage.get({ key: key });
    return this._parse(ret.value);
  }
  // unknown why but sometimes data comes back encoded in such a way that JSON.parse
  // still returns a string
  _parse(data: any): any {
    if (typeof data === "string") {
      const parsed = JSON.parse(data);
      return this._parse(parsed);
    } else {
      return data;
    }
  }

  /******************************************************************************************
                               Server DB Storage Functions
  /*****************************************************************************************/
  // on file upload also generate download link and populate file meta
  async uploadFile(path: string, blob: Blob) {
    const upload = await this.serverStorage.ref(path).put(blob);
    const downloadUrl = await this.serverStorage
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
  _getUploadMetaSubset(meta: FullMetadata) {
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
