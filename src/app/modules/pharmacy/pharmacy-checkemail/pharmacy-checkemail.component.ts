import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import {
  ISendEmailRequest,
  ISendOtpResponse,
} from "../pharmacy-entercode/pharmacy-entercode.type";
import { Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../pharmacy.service";
import { IResponse } from "src/app/shared/classes/api-response";

@Component({
  selector: "app-pharmacy-checkemail",
  templateUrl: "./pharmacy-checkemail.component.html",
  styleUrls: ["./pharmacy-checkemail.component.scss"],
})
export class PharmacyCheckemailComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  email: string = "";

  constructor(
    private location: Location,
    private router: Router,
    private pharmacyService: PharmacyService,
    private coreService: CoreService
  ) {}

  ngOnInit(): void {
    const locationInfo = this.location.getState() as ISendEmailRequest;
    if (locationInfo && locationInfo.email === undefined) {
      this.router.navigateByUrl("/pharmacy/login");
    } else {
      this.email = locationInfo.email;
    }
  }

  sendEmailUser() {
    const emailRequest: ISendEmailRequest = {
      email: this.email,
    };
    this.pharmacyService.sendVerifyEmail(emailRequest).subscribe({
      next: (result: IResponse<ISendOtpResponse>) => {
        if (result.status === true) {
          // console.log(":::: otp send successfully ::::")
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }
}
