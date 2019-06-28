import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { NativeFileService } from "./native.file.service";
import { HttpClient } from "@angular/common/http";
import { IUploadedFileMeta } from "src/models/common.model";

declare const window;

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class NativeStorageService extends StorageBase
  implements IStorageService {
  constructor(
    serverStorage: AngularFireStorage,
    private fileService: NativeFileService,
    private http: HttpClient
  ) {
    super(serverStorage);
    console.log("[Web] storage service");
  }

  /******************************************************************************************
                                File Storage Functions
  /*****************************************************************************************/
  async addToFileCache() {
    // TODO
  }
  // NOTE - won't work as can't access local folder. Perhaps use http to copy from problems
  async copyAppAsset(file: IUploadedFileMeta): Promise<void> {
    await this.fileService.copyAssetFile(file.fullPath);
  }
}
