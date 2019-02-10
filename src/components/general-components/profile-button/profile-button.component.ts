import { Component, OnInit } from "@angular/core";
import { UserService } from "src/services/user.service";
import { ModalController } from "@ionic/angular";
import { User } from "src/models/user.model";
import { LoginPage } from "src/pages/login/login.page";

@Component({
  selector: "app-profile-button",
  templateUrl: "./profile-button.component.html",
  styleUrls: ["./profile-button.component.scss"]
})
export class ProfileButtonComponent implements OnInit {
  user: User;
  loginModal: HTMLIonModalElement;
  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) {
    this.userService.user.subscribe(u => {
      this.user = u;
      // check if modal is open, if it is then close
      this.modalCtrl.getTop().then(v => {
        v ? this.modalCtrl.dismiss() : null;
      });
      console.log("user", u);
    });
  }

  ngOnInit() {}

  async showLogin() {
    this.loginModal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: "login-modal"
    });
    return await this.loginModal.present();
  }

  async logout() {
    this.userService.logout();
  }
}
