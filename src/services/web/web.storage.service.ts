import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { IUploadedFileMeta } from "src/models/common.model";
import { WebServiceWorkerService } from "./web.sw.service";

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class WebStorageService extends StorageBase implements IStorageService {
  constructor(
    serverStorage: AngularFireStorage,
    private sw: WebServiceWorkerService
  ) {
    super(serverStorage);
    console.log("[Web] storage service");
  }

  /******************************************************************************************
                                File Storage Functions
  /*****************************************************************************************/

  async addFilesToCache(files: IUploadedFileMeta[]): Promise<void> {
    // ToDo
    const urls: string[] = files.map(f => f.downloadUrl);
    console.log("WEB ADD FILES TO CACHE METHOD TODO");
  }
  private _addFileToCache(file: IUploadedFileMeta) {}

  async copyAppAsset(file: IUploadedFileMeta): Promise<void> {
    // not required on web (?)
  }
}
