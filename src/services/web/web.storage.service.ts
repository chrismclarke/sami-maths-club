import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { IUploadedFileMeta } from "src/models/common.model";
import { WebServiceWorkerService } from "./web.sw.service";
import { sleep } from "src/utils/utils";

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
    // await sleep(1000);
  }

  async copyAppAsset(file: IUploadedFileMeta): Promise<void> {
    // not required on web
  }
  async getCachedFileURI(file: IUploadedFileMeta): Promise<string> {
    // not required on web
    return `example.com/${file.fullPath}`;
  }
  async openFile(file: IUploadedFileMeta): Promise<void> {
    console.log("opening file", file);
    window.open(file.downloadUrl, "_blank");
  }
}
