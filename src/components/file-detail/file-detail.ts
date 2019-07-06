import { Component, Input } from "@angular/core";
import { IUploadedFileMeta } from "src/models/common.model";

@Component({
  selector: "app-file-detail",
  templateUrl: "./file-detail.html",
  styleUrls: ["./file-detail.scss"]
})
export class FileDetailComponent {
  @Input() file: IUploadedFileMeta;
}
