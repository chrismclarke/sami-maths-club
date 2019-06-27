import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class WebServiceWorkerService {
  constructor(private sw: ServiceWorker) {
    this.init();
  }

  init() {
    if (environment.production) {
    }
  }

  /******************************************************************************************
                                Public Methods
  /*****************************************************************************************/
}
