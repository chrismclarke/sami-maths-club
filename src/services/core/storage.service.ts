import { IUploadedFileMeta, FullMetadata } from "src/models/common.model";

export abstract class AbstractStorageService {
  abstract uploadFile(path: string, blob: Blob): Promise<IUploadedFileMeta>;
  abstract _getUploadMetaSubset(meta: FullMetadata): Partial<IUploadedFileMeta>;
}
