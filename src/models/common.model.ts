import { storage, firestore } from "firebase/app";
import { ProblemEndoint } from "./problem.model";

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
  _androidPath?: string;
}

// timestamps used in hardcoded docs only contain base info
export interface ITimestamp extends Partial<firestore.Timestamp> {
  seconds: number;
  nanoseconds: number;
}

// endpoints used to access server and local storage data
export type IDBEndpoint = ProblemEndoint | "users";

// standard features on all database docs
export interface IDBDoc {
  _key: string;
  _modified: ITimestamp;
  _created: ITimestamp;
}
