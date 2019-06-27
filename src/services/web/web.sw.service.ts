import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { SwUpdate } from "@angular/service-worker";
import { ToastController } from "@ionic/angular";

// Note - no 'providedIn' syntax as not declared in root app.module.ts but instead web.module.ts
@Injectable()
export class WebServiceWorkerService {
  constructor(private swUpdate: SwUpdate, private toastCtrl: ToastController) {
    this.init();
  }
  /*******************************************************************************
   *    TODO - Review below, possibly change toast over for capacitor toast
   *    NOTE - if toast doesn't display could create swcheck component again?
   *            (possibly not ideal as selective display requires extra logic and module declaration)
   *******************************************************************************/
  init() {
    if (environment.production) {
      this.checkForSWUpdate();
    }
  }

  /******************************************************************************************
                                Public Methods
  /*****************************************************************************************/

  // service worker update
  checkForSWUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async () => {
        this.showUpdateToast();
      });
    }
  }

  async showUpdateToast() {
    const toast = await this.toastCtrl.create({
      message: "App Updated",
      closeButtonText: "Reload",
      cssClass: "toast--sw-update",
      position: "bottom",
      duration: 0,
      showCloseButton: true
    });
    toast.present();
    await toast.onWillDismiss();
    this.activateUpdate();
  }
  async activateUpdate() {
    await this.swUpdate.activateUpdate();
    location.reload(true);
    return;
  }
}
