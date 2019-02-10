import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-sw-check",
  template: ``
})
export class SWCheckComponent implements OnInit {
  constructor(private swUpdate: SwUpdate, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.checkForSWUpdate();
  }

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
