import { Injectable } from "@angular/core";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";

const { Filesystem } = Plugins;
import { File, FileEntry, DirectoryEntry } from "@ionic-native/file/ngx";
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
  dataDir = FilesystemDirectory.Data;
  // public docs directory
  docsDir = FilesystemDirectory.Documents;
  // app dir provides read-only to app contents
  appDir = FilesystemDirectory.Application;
  assetsDir: string;
  // additional use of ionic-native file for accessing application dir
  constructor(private file: File) {
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
  async ensureDir(path: string) {
    try {
      await Filesystem.readdir({
        directory: this.dataDir,
        path: path
      });
      return;
    } catch (error) {
      return this.mkdir(path);
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

  //  take file relative to src/assets/files and copy to device data
  async copyAssetFile(assetFilePath: string) {
    const path = `${this.assetsDir}files/${assetFilePath}`;
    const targetDirPath = assetFilePath.substring(
      0,
      assetFilePath.lastIndexOf("/")
    );
    try {
      const assetFile = (await this.resolveFileSystemUrl(path)) as FileEntry;
      await this.ensureDir(targetDirPath);
      const targetDir = (await this.resolveFileSystemUrl(
        `${this.file.dataDirectory}${targetDirPath}`
      )) as DirectoryEntry;
      await this.copyFile(assetFile, targetDir);
    } catch (error) {
      const ls = await this.listDir(targetDirPath);
      throw error;
    }
  }

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
   *                 Not Currently Used (placeholders)
   ***********************************************************************************************/

  async getUri(path: string, rootDir?: keyof typeof FilesystemDirectory) {
    return Filesystem.getUri({
      path: path,
      directory: FilesystemDirectory[rootDir]
    });
  }

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
