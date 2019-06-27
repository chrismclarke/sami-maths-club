import { Injectable } from "@angular/core";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
  MkdirResult
} from "@capacitor/core";

const { Filesystem } = Plugins;

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class NativeFileService {
  // data directory not sync'd to cloud and kept private to app
  dataDir = FilesystemDirectory.Data;
  // docs dir subdir of data, but made available to other apps (good for saved screenshots etc.)
  docsDir = FilesystemDirectory.Documents;
  // app dir provides read-only to app contents
  appDir = FilesystemDirectory.Application;
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

  async mkdir(path: string) {
    try {
      await Filesystem.mkdir({
        path: path,
        directory: this.dataDir,
        createIntermediateDirectories: true // like mkdir -p
      });
    } catch (error) {
      console.log("error", error);
      // ignore directory exists error
      if (error.message !== "Directory exists") {
        throw error;
      }
    }
    return;
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

  async readdir(path: string, root: "data" | "app" = "data") {
    const rootDir = root === "data" ? this.dataDir : this.appDir;
    return Filesystem.readdir({
      path: path,
      directory: rootDir
    });
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
