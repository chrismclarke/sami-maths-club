import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { environment } from "../environments/environment";

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
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      } else {
      }
    });
  }
}
