import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { StorageBase, IStorageService } from "../core/storage.service";
import { NativeFileService } from "./native.file.service";

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class NativeStorageService extends StorageBase
  implements IStorageService {
  constructor(
    serverStorage: AngularFireStorage,
    private fileService: NativeFileService
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
  async copyAppFolder(folderPath: string): Promise<void> {
    await this.fileService.mkdir(folderPath);
    console.log("folder path made");
    const filesToCopy = await this.fileService.readdir(folderPath, "app");
    console.log("copying files", filesToCopy);
  }
}
