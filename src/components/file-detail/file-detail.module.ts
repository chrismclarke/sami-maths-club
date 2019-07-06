import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileDetailComponent } from "./file-detail";
import { IonicModule } from "@ionic/angular";
import { AppFileIconComponent } from "./file-icon";
// import uploader module to access file-size pipe
import { FileUploaderModule } from "../file-uploader/file-uploader.module";

@NgModule({
  imports: [CommonModule, IonicModule, FileUploaderModule],
  declarations: [FileDetailComponent, AppFileIconComponent],
  exports: [FileDetailComponent]
})
export class FileDetailModule {}
