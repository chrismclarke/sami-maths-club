import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { IUploadedFileMeta } from "src/models/common.model";

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class WebStorageService extends StorageBase implements IStorageService {
  constructor(serverStorage: AngularFireStorage) {
    super(serverStorage);
    console.log("[Web] storage service");
  }

  /******************************************************************************************
                                File Storage Functions
  /*****************************************************************************************/

  async addToFileCache(downloadUrl: string) {
    // Todo
  }
  async copyAppAsset(file: IUploadedFileMeta): Promise<void> {
    // not required on web (?)
  }
}
