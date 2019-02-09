import { Component } from "@angular/core";

import { Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { environment } from "../environments/environment";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  version = environment.VERSION;
  public appPages = [
    // {
    //   title: "Home",
    //   url: "/home",
    //   icon: "home"
    // },
    {
      title: "Problems",
      url: "/problems",
      customIcon: "/assets/svgs/problems.svg"
    }
    // {
    //   title: "My club",
    //   url: "/my-club",
    //   customIcon: "/assets/svgs/club.svg"
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      } else {
        this.checkForSWUpdate();
      }
    });
  }

  // service worker update
  checkForSWUpdate() {
    console.log("checking sw update");
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async () => {
        const toast = await this.toastCtrl.create({
          message: "Update Downloaded",
          closeButtonText: "Reload",
          cssClass: "toast--sw-update",
          position: "bottom",
          duration: 0,
          showCloseButton: true
        });
        toast.present();
        await toast.onWillDismiss;
        this.activateUpdate();
      });
    }
  }
  async activateUpdate() {
    console.log("activating update");
    await this.swUpdate.activateUpdate();
    location.reload(true);
    return;
  }
}
