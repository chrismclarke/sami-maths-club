import { Component } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;
import { Platform } from "@ionic/angular";
import { environment } from "../environments";

interface IPage {
  title: string;
  url: string;
  icon?: string;
  customIcon?: string;
}
@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  version = environment.VERSION;
  public appPages: IPage[] = [
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
    console.log("initialise");
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("platform ready");
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
