import { Injectable } from "@angular/core";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";

const { Filesystem } = Plugins;
import { File, FileEntry, DirectoryEntry } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileTransferObject,
  FileTransferError
} from "@ionic-native/file-transfer/ngx";
import { IUploadedFileMeta } from "src/models/common.model";
declare const window: any;

/******************************************************************************************
 * Uses a mix of both cordova and capacitor file methods as for some reason capacitor doesn't
 * resolve the application directory correctly and therefore can't locate or access local
 * app assets
 *****************************************************************************************/

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class NativeFileService {
  // data directory not sync'd to cloud and kept private to app
  // i.e. file:///data/user/0/io.c2dev.samimathsclub/files
  dataDir = FilesystemDirectory.Data;
  // public docs directory
  docsDir = FilesystemDirectory.Documents;
  // app dir provides read-only to app contents
  appDir = FilesystemDirectory.Application;
  // src assets folder
  assetsDir: string;
  // additional use of ionic-native file for accessing application dir
  constructor(private file: File, private transfer: FileTransfer) {
    this.assetsDir = `${this.file.applicationDirectory}public/assets/`;
  }

  /***********************************************************************************************
   *                  Directory Methods
   ***********************************************************************************************/
  // custom method to list directory, requires cordova-plugin-file installed
  // https://stackoverflow.com/questions/28937878/cordova-list-all-files-from-application-directory-wwws
  async listDir(path: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileSystem = (await this.resolveFileSystemUrl(
          path
        )) as DirectoryEntry;
        const reader = fileSystem.createReader();
        reader.readEntries(
          entries => {
            resolve(entries);
          },
          err => reject(err)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  private async resolveFileSystemUrl(
    path: string
    // Note - allow 'any' type as otherwise throws unknown error
  ): Promise<any | DirectoryEntry | FileEntry> {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(
        path,
        (result: DirectoryEntry | FileEntry) => {
          resolve(result);
        },
        (err: Error) => reject(err)
      );
    });
  }

  async mkdir(path: string) {
    console.log("making directory", path);
    try {
      await Filesystem.mkdir({
        path: path,
        directory: this.dataDir,
        createIntermediateDirectories: true // like mkdir -p
      });
    } catch (error) {
      // ignore directory exists error
      if (error.message === "Directory exists") {
      } else {
        console.log("mk dir error");
        throw error;
      }
    }
    return;
  }
  // take a folder path and ensure base folder exists (non-recursive)
  // returns the full uri of the directory
  async ensureDataDir(folderPath: string): Promise<void> {
    // get base folder of files
    try {
      // try a file system read which will throw error if doesn't exist
      await Filesystem.readdir({
        directory: this.dataDir,
        path: folderPath
      });
      return;
    } catch (error) {
      // if does not exist create
      await this.mkdir(folderPath);
      return this.ensureDataDir(folderPath);
    }
  }

  // Untested method to copy entire folder
  async copyAssetFolder(assetFolder: string) {
    const assetDir = (await this.resolveFileSystemUrl(
      `${this.file.applicationDirectory}public/assets/${assetFolder}`
    )) as DirectoryEntry;
    const targetDir = (await this.resolveFileSystemUrl(
      `${this.file.dataDirectory}`
    )) as DirectoryEntry;
    return new Promise(async (resolve, reject) => {
      assetDir.copyTo(
        targetDir,
        assetFolder,
        result => resolve(result),
        err => reject(err)
      );
    });
  }

  /***********************************************************************************************
   *                  File Methods
   ***********************************************************************************************/

  async downloadFile(file: IUploadedFileMeta) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    await this.ensureDataDir(this._getFileFolderPath(file.fullPath));
    const uri = await this.getUri(file.fullPath, "Data");
    console.log("downloading", file.downloadUrl, uri);
    try {
      const downloadEntry: FileEntry = await fileTransfer.download(
        file.downloadUrl,
        uri
      );
      return downloadEntry.toURL();
    } catch (error) {
      // many possible reasons which aren't always captured correctly
      // (e.g. connection issue if invalid permissions). Just throw error
      const err: FileTransferError = error;
      console.error(err);
      throw err;
    }
  }

  //  take file relative to src/assets/files and copy to device data
  async copyAssetFile(assetFilePath: string) {
    const path = `${this.assetsDir}files/${assetFilePath}`;
    const targetDirPath = this._getFileFolderPath(assetFilePath);
    try {
      const assetFile = (await this.resolveFileSystemUrl(path)) as FileEntry;
      await this.ensureDataDir(this._getFileFolderPath(assetFilePath));
      const targetDir = (await this.resolveFileSystemUrl(
        `${this.file.dataDirectory}${targetDirPath}`
      )) as DirectoryEntry;
      console.log("copying asset file", assetFile, targetDir);
      await this.copyFile(assetFile, targetDir);
    } catch (error) {
      const ls = await this.listDir(targetDirPath);
      throw error;
    }
  }

  // get full file-system path to a directory or file
  private async getUri(
    path: string,
    rootDir: keyof typeof FilesystemDirectory
  ) {
    const uriReq = await Filesystem.getUri({
      path: path,
      directory: FilesystemDirectory[rootDir]
    });
    return uriReq.uri;
  }

  // get url representing path to a file, e.g. cordova-file:///data.0.app.data.example.png
  public async getLocalFileUri(
    path: string,
    rootDir: keyof typeof FilesystemDirectory
  ) {
    const uri = await this.getUri(path, rootDir);
    return (<any>window).Ionic.WebView.convertFileSrc(uri);
  }

  // copy file from src directory to any other
  private async copyFile(
    srcFile: FileEntry,
    parentDirectory: DirectoryEntry,
    newName?: string
  ) {
    return new Promise((resolve, reject) => {
      srcFile.copyTo(
        parentDirectory,
        newName,
        success => {
          console.log("file copied successfully", srcFile);
          resolve(success);
        },
        err => {
          console.log("file copy failed", srcFile);
          reject(err);
        }
      );
    });
  }

  /***********************************************************************************************
   *                 Helper Methods
   ***********************************************************************************************/

  // return the full folder path of a file (e.g. folder/a/b/c/file.png -> folder/a/b/c)
  private _getFileFolderPath(path: string) {
    return path.substring(0, path.lastIndexOf("/"));
  }

  /***********************************************************************************************
   *                 Not Currently Used (placeholders)
   ***********************************************************************************************/

  async rmdir() {
    try {
      const ret = await Filesystem.rmdir({
        path: "secrets",
        directory: this.dataDir
      });
    } catch (e) {
      console.error("Unable to remove directory", e);
    }
  }

  async readdir(path: string, rootDir?: keyof typeof FilesystemDirectory) {
    try {
      return Filesystem.readdir({
        path: path,
        directory: FilesystemDirectory[rootDir]
      });
    } catch (error) {
      // likely dir doesn't exist
      return null;
    }
  }

  async stat() {
    try {
      const ret = await Filesystem.stat({
        path: "secrets/text.txt",
        directory: this.dataDir
      });
    } catch (e) {
      console.error("Unable to stat file", e);
    }
  }

  fileWrite() {
    try {
      Filesystem.writeFile({
        path: "secrets/text.txt",
        data: "This is a test",
        directory: this.dataDir,
        encoding: FilesystemEncoding.UTF8
      });
    } catch (e) {
      console.error("Unable to write file", e);
    }
  }

  async fileRead() {
    const contents = await Filesystem.readFile({
      path: "secrets/text.txt",
      directory: this.dataDir,
      encoding: FilesystemEncoding.UTF8
    });
    console.log(contents);
  }

  async fileAppend() {
    await Filesystem.appendFile({
      path: "secrets/text.txt",
      data: "MORE TESTS",
      directory: this.dataDir,
      encoding: FilesystemEncoding.UTF8
    });
  }

  async fileDelete() {
    await Filesystem.deleteFile({
      path: "secrets/text.txt",
      directory: this.dataDir
    });
  }

  async readFilePath() {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    try {
      const data = await Filesystem.readFile({
        path:
          "file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt"
      });
    } catch (err) {
      throw err;
    }
  }

  async rename() {
    try {
      const ret = await Filesystem.rename({
        from: "text.txt",
        to: "text2.txt",
        directory: this.dataDir
      });
    } catch (e) {
      console.error("Unable to rename file", e);
    }
  }
}
