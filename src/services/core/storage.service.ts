import {
  IUploadedFileMeta,
  FullMetadata,
  ICacheEndpoint
} from "src/models/common.model";
import { Plugins, StoragePlugin } from "@capacitor/core";
const { Storage } = Plugins;

/* storage class handles both local (indexedDB) cache storage as well as
 * file caching
 */

/************************************************************************
 * Interface
 ************************************************************************/
// methods implemented same for all
interface IStorageServiceBase {
  storage: StoragePlugin;
  get(cacheKey: ICacheEndpoint): Promise<string | null>;
  _getUploadMetaSubset(meta: FullMetadata): Partial<IUploadedFileMeta>;
}
// methods that vary by pwa/native implementation
export interface IStorageService extends IStorageServiceBase {
  uploadFile(path: string, blob: Blob): Promise<IUploadedFileMeta>;
  addToFileCache(downloadUrl: string): Promise<void>;
}

/************************************************************************
 * Base class
 ************************************************************************/

export class StorageBase implements IStorageServiceBase {
  public storage = Storage;
  constructor() {
    console.log("[Base] storage service");
  }
  async get(key: ICacheEndpoint): Promise<string | null> {
    const ret = await this.storage.get({ key: key });
    return ret.value;
  }

  _getUploadMetaSubset(meta: FullMetadata) {
    return (({
      bucket,
      contentType,
      fullPath,
      name,
      size,
      timeCreated,
      updated
    }) => ({
      bucket,
      contentType,
      fullPath,
      name,
      size,
      timeCreated,
      updated
    }))(meta);
  }
}
