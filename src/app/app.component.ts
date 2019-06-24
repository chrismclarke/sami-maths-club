import { Component } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;
import { Platform } from "@ionic/angular";
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

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (environment.isAndroid) {
        SplashScreen.show({
          showDuration: 2000,
          autoHide: true
        });
      } else {
      }
    });
  }
}
