import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { NativeFileService } from "./native.file.service";
import { IUploadedFileMeta } from "src/models/common.model";

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class NativeStorageService extends StorageBase
  implements IStorageService {
  constructor(
    serverStorage: AngularFireStorage,
    private fileService: NativeFileService
  ) {
    super(serverStorage);
    console.log("[Native] storage service");
  }

  /******************************************************************************************
                                File Storage Functions
  /*****************************************************************************************/
  async addFilesToCache(files: IUploadedFileMeta[]): Promise<void> {
    console.log("adding files to cache", files);
    const promises = files.map(async f => {
      await this._addFileToCache(f);
    });
    await Promise.all(promises);
    console.log("all files successfully added");
  }

  getCachedFileURI(file: IUploadedFileMeta): Promise<string> {
    return this.fileService.getLocalFileUri(file.fullPath, "Data");
  }
  private async _addFileToCache(file: IUploadedFileMeta) {
    console.log("adding file to cache", file);
    await this.fileService.downloadFile(file);
    console.log("file added succesfully");
  }
  async copyAppAsset(file: IUploadedFileMeta): Promise<void> {
    await this.fileService.copyAssetFile(file.fullPath);
  }
  async openFile(file: IUploadedFileMeta): Promise<void> {
    return this.fileService.openFile(file);
  }
}
