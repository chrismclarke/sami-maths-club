import { Component } from "@angular/core";
import { UserService } from "src/services/user.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage {
  loginForm: FormGroup;
  errorMsg: string;
  constructor(public userService: UserService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ["", Validators.email],
      password: ["", Validators.required]
    });
    this.loginForm.valueChanges.subscribe(v => {
      this.errorMsg = "";
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.userService.login(email, password).catch(err => {
      this.errorMsg = err.code;
    });
  }

  register() {
    const { email, password } = this.loginForm.value;
    this.userService.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(err => {
        this.errorMsg = err.code;
      });
  }
  pwReset() {
    const { email, password } = this.loginForm.value;
    this.userService.afAuth.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.errorMsg = "Password reset email sent";
      })
      .catch(err => {
        this.errorMsg = err.code;
      });
  }
}
