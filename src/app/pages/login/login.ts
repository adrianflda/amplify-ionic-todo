import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["./login.scss"],
})
export class LoginPage {
  submitted = false;

  constructor(public router: Router) {}

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.router.navigateByUrl("/app/tabs/schedule");
    }
  }
}
