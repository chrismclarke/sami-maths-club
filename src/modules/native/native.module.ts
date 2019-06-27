import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
@NgModule({
  declarations: [],
  imports: [CommonModule]
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
