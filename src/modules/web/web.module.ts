import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "src/environments";
import { WebStorageService } from "src/services/web/web.storage.service";
import { WebServiceWorkerService } from "src/services/web/web.sw.service";

/* Use web module with conditional import in app.js to register service worker only in web environment 
   Note - currently a 'provider' module (no components imported/exported). If that is changed then would
   also want to provide static 'forRoot' methods to prevent re-initialisation of providers:
   https://angular.io/guide/singleton-services#the-forroot-pattern
*/
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [WebStorageService, WebServiceWorkerService]
})
// prevent reimport of module
export class WebModule {
  constructor(@Optional() @SkipSelf() parentModule: WebModule) {
    if (parentModule) {
      throw new Error(
        "Native is already loaded. Import it in the AppModule only"
      );
    }
  }
}
