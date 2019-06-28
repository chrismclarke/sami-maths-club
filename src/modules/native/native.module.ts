import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { File } from "@ionic-native/file/ngx";
import { NativeFileService } from "src/services/native/native.file.service";
import { NativeStorageService } from "src/services/native/native.storage.service";
import { HttpClientModule } from "@angular/common/http";
@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [NativeFileService, NativeStorageService, File]
})
// prevent reimport of module
export class NativeModule {
  constructor(@Optional() @SkipSelf() parentModule: NativeModule) {
    if (parentModule) {
      throw new Error(
        "Native is already loaded. Import it in the AppModule only"
      );
    }
  }
}
