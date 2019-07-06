import { Component, Input, Output, EventEmitter } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";
import { IUploadedFileMeta, FullMetadata } from "src/models/common.model";

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.html",
  styleUrls: ["./file-uploader.scss"]
})

/*  Firebase storage uploader, includes drag/drop and emits custom metadata subset on completion
    TODO  - code duplication between this and storage service, could possibly be improved 
            (unless want to keep standalone, in which case should move code out to other non-general component)
          - drag/drop filetype validation
*/
export class FileUploaderComponent {
  @Input() storageFolder = "_tmp";
  @Input() accept = "image/png, image/jpeg, .pdf";
  @Input() customMeta: any = {};
  @Output() complete: EventEmitter<IUploadedFileMeta> = new EventEmitter();
  status: "ready" | "uploading" | "finalising" | "complete" = "ready";
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(private serverStorage: AngularFireStorage) {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // if file drag-dropped will need to check client-side for restrictions
  fileTypeValid(file: File): boolean {
    // *** TODO
    const acceptTypes = this.accept.split(",");
    const fileType = file.type;
    return true;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);
    // Client-side validation example
    if (!this.fileTypeValid(file)) {
      return;
    }
    this.status = "uploading";
    const path = `uploads/${this.storageFolder}/${file.name}`;
    this.task = this.serverStorage.upload(path, file, { ...this.customMeta });
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task
      .snapshotChanges()
      .pipe(finalize(() => this.finaliseUpload(path)));
  }

  async finaliseUpload(path: string) {
    console.log("finalising upload", path);
    this.status = "finalising";
    const uploadMeta = await this.serverStorage
      .ref(path)
      .getMetadata()
      .toPromise();
    const downloadUrl = await this.serverStorage
      .ref(path)
      .getDownloadURL()
      .toPromise();
    const meta: IUploadedFileMeta = {
      ...this._getUploadMetaSubset(uploadMeta),
      downloadUrl: downloadUrl
    };
    this.complete.emit(meta);
    this.status = "complete";
  }

  private _getUploadMetaSubset(meta: FullMetadata) {
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
