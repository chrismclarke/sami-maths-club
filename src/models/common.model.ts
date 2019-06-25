import { storage } from "firebase/storage";

// tslint:disable no-empty-interface
export interface FullMetadata extends storage.FullMetadata {}
export interface IUploadedFileMeta extends Partial<FullMetadata> {
  downloadUrl: string;
  bucket: string;
  contentType: string;
  fullPath: string;
  name: string;
  size: number;
  timeCreated: string;
  updated: string;
}
