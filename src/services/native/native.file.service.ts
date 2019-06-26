import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Filesystem } = Plugins;

fileWrite() {
  try {
    Filesystem.writeFile({
      path: 'secrets/text.txt',
      data: "This is a test",
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8
    })
  } catch(e) {
    console.error('Unable to write file', e);
  }
}

async fileRead() {
  let contents = await Filesystem.readFile({
    path: 'secrets/text.txt',
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8
  });
  console.log(contents);
}

async fileAppend() {
  await Filesystem.appendFile({
    path: 'secrets/text.txt',
    data: "MORE TESTS",
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8
  });
}

async fileDelete() {
  await Filesystem.deleteFile({
    path: 'secrets/text.txt',
    directory: FilesystemDirectory.Documents
  });
}

async mkdir() {
  try {
    let ret = await Filesystem.mkdir({
      path: 'secrets',
      directory: FilesystemDirectory.Documents,
      createIntermediateDirectories: false // like mkdir -p
    });
  } catch(e) {
    console.error('Unable to make directory', e);
  }
}

async rmdir() {
  try {
    let ret = await Filesystem.rmdir({
      path: 'secrets',
      directory: FilesystemDirectory.Documents
    });
  } catch(e) {
    console.error('Unable to remove directory', e);
  }
}

async readdir() {
  try {
    let ret = await Filesystem.readdir({
      path: 'secrets',
      directory: FilesystemDirectory.Documents
    });
  } catch(e) {
    console.error('Unable to read dir', e);
  }
}

async stat() {
  try {
    let ret = await Filesystem.stat({
      path: 'secrets/text.txt',
      directory: FilesystemDirectory.Documents
    });
  } catch(e) {
    console.error('Unable to stat file', e);
  }
}

async readFilePath() {
  // Here's an example of reading a file with a full file path. Use this to
  // read binary data (base64 encoded) from plugins that return File URIs, such as
  // the Camera.
  try {
    let data = await Filesystem.readFile({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
    })
  }
}

async rename() {
  try {
    let ret = await Filesystem.rename({
      from: 'text.txt',
      to: 'text2.txt',
      directory: FilesystemDirectory.Documents
    });
  } catch(e) {
    console.error('Unable to rename file', e);
  }
}