import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropZoneDirective } from "./drop-zone.directive";
import { FileSizePipe } from "./file-size.pipe";
import { FileUploaderComponent } from "./file-uploader";

@NgModule({
  imports: [CommonModule],
  declarations: [FileUploaderComponent, DropZoneDirective, FileSizePipe],
  exports: [FileUploaderComponent, FileSizePipe]
})
export class FileUploaderModule {}
