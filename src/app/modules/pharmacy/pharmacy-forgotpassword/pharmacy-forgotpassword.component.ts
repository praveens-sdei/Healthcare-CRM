import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import {
  ISendEmailRequest,
  ISendOtpResponse,
} from "../pharmacy-entercode/pharmacy-entercode.type";
import { PharmacyService } from "../pharmacy.service";

@Component({
  selector: "app-pharmacy-forgotpassword",
  templateUrl: "./pharmacy-forgotpassword.component.html",
  styleUrls: ["./pharmacy-forgotpassword.component.scss"],
})
export class PharmacyForgotpasswordComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  public forgotPasswordFields: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required]),
  });
  constructor(
    private router: Router,
    private pharmacyService: PharmacyService,
    private coreService: CoreService
  ) {}

  ngOnInit(): void {}

  private getPasswordField(field: string) {
    return this.forgotPasswordFields.get(field).value;
  }

  forgotPasswordFlow() {
    if (this.forgotPasswordFields.invalid) {
      return;
    }
    const forgotPasswordRequest: ISendEmailRequest = {
      email: this.getPasswordField("email"),
    };
    this.pharmacyService.forgotPasswordUser(forgotPasswordRequest).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
       console.log("resullllltt",result);
       
        if (result.status === true) {
          // console.log(":::: otp send successfully ::::")
             this.coreService.showSuccess("", result.message);
          this.router.navigateByUrl("/pharmacy/login", {
            state: { email: this.getPasswordField("email") },
          });
        }else{
          this.coreService.showError("", result.message);
        }
      },
      error: (err: ErrorEvent) => {
        console.log("errrrrrr", err);
        
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }
}
