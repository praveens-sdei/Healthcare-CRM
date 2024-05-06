import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import {
  ILocationData,
  ISendEmailRequest,
  ISendOtpRequest,
  ISendOtpResponse,
  IVerifyOtpRequest,
} from "./pharmacy-entercode.type";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PharmacyService } from "../pharmacy.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyPlanService } from "../pharmacy-plan.service";
import { AuthService } from "src/app/shared/auth.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-pharmacy-entercode",
  templateUrl: "./pharmacy-entercode.component.html",
  styleUrls: ["./pharmacy-entercode.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PharmacyEntercodeComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  private locationData: ILocationData = {
    email: "",
    userId: "",
    mode: "mobile",
    phoneNumber: "",
    countryCode: "+91",
  };
  otpContext: string = "";
  isDisabled: boolean = true;
  // public otpFields: FormGroup = new FormGroup(
  //   {
  //     firstDigit: new FormControl("", [Validators.required]),
  //     secondDigit: new FormControl("", [Validators.required]),
  //     thirdDigit: new FormControl("", Validators.required),
  //     fourthDigit: new FormControl("", Validators.required),
  //     fifthDigit: new FormControl("", Validators.required),
  //     sixthDigit: new FormControl("", Validators.required),
  //   },
  //   { validators: [] }
  // );

  loginCreds: any;

  constructor(
    private location: Location,
    private router: Router,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private _pharService: PharmacyPlanService,
    private auth: AuthService,
    private route: Router,
  ) {
    console.log(this.router.getCurrentNavigation().extras.state);
  }

  ngOnInit(): void {
    this.loginCreds = JSON.parse(sessionStorage.getItem("loginCreds"));
    const locationInfo = this.location.getState() as ILocationData;
    console.log(locationInfo,"locationInfo");
    
    if (locationInfo.mode == "mobile") {
      this.locationData.mode = locationInfo.mode;
      this.locationData.countryCode = locationInfo.countryCode;
      this.locationData.phoneNumber = locationInfo.phoneNumber;
      this.locationData.userId = locationInfo.userId;
      this.locationData.email = locationInfo.email.toLowerCase();
      this.otpContext = this.maskCharacter(
        locationInfo.countryCode + locationInfo.phoneNumber,
        "*",
        3
      );
      console.log(this.otpContext);
      this.sendOtpUser();
    }
    if (locationInfo.mode == "email") {
      this.locationData.mode = locationInfo.mode;
      this.locationData.email = locationInfo.email.toLowerCase();
      this.locationData.userId = locationInfo.userId;
      this.otpContext = this.maskCharacter(locationInfo.email, "*", 3);
      console.log(this.otpContext);
      this.sendEmailUser();
    }
    if (locationInfo && locationInfo.userId === undefined) {
      this.router.navigateByUrl("/pharmacy/login");
    }
    console.log(locationInfo, history.state);
  }

  maskCharacter(str: string, mask, n = 1) {
    return (
      ("" + str).slice(0, n) +
      ("" + str).slice(n, -n).replace(/./g, mask) +
      ("" + str).slice(-n)
    );
  }

  resendOtpDetails() {
    if (this.locationData.mode === "mobile") {
      this.sendOtpUser();
    }
    if (this.locationData.mode === "email") {
      this.sendEmailUser();
    }
  }

  // private getOtpField(field: string) {
  //   return this.otpFields.get(field).value;
  // }

  config = {
    allowNumbersOnly: true,
    length: 6,

    disableAutoFocus: false,
    placeholder: "0",
  };

  onOtpChange(event: any) {
    if (event.length == 6) {
      this.isDisabled = false;
    }
  }

  private sendOtpUser() {
    const otpRequest: ISendOtpRequest = {
      // mobile: this.locationData.phoneNumber,
      // country_code: this.locationData.countryCode,
      email: this.locationData.email.toLowerCase(),
    };
    console.log(otpRequest);

    this._pharService.getVerificationCodeMobile(otpRequest).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
        console.log(result);
        if (result.status === true) {
          this.coreService.showSuccess("", result.message)         
          this.route.navigate(['/pharmacy/entercode'], {
            state: {
              mobile:  this.locationData.phoneNumber,
              country_code: this.locationData.countryCode,
              mode: this.locationData.mode,
              userId: this.locationData.userId 
            }
          });
          // console.log(":::: otp send successfully ::::")
        }else{
          this.coreService.showError("", result.message)         

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

  private sendEmailUser() {
    const emailRequest: ISendEmailRequest = {
      email: this.locationData.email.toLowerCase(),
    };
    this._pharService.getVerificationCodeEmail(emailRequest).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
        if (result.status === true) {
          this.coreService.showSuccess("", result.message) 
          this.route.navigate(['/pharmacy/entercode'], {
            state: {
              mobile:  this.locationData.phoneNumber,
              country_code: this.locationData.countryCode,
              mode: this.locationData.mode,
              userId: this.locationData.userId 
            }
          });
        }else{
          this.coreService.showError("", result.message) 

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

  // submitOtp() {
  //   if (this.otpFields.invalid) {
  //     return;
  //   }
  //   const otpArray = [
  //     this.getOtpField("firstDigit"),
  //     this.getOtpField("secondDigit"),
  //     this.getOtpField("thirdDigit"),
  //     this.getOtpField("fourthDigit"),
  //     this.getOtpField("fifthDigit"),
  //     this.getOtpField("sixthDigit"),
  //   ];
  //   const otpValue = otpArray.join("");
  //   const verifyOtpRequest: IVerifyOtpRequest = {
  //     otp: otpValue,
  //     for_portal_user: this.locationData.userId,
  //   };
  //   this.pharmacyService.verifyOtp(verifyOtpRequest).subscribe({
  //     next: (res: IResponse<ISendOtpResponse>) => {
  //       let result = this.coreService.decryptContext(res);
  //       if (result.status === true) {
  //         // console.log(":::: otp send successfully ::::")
  //         this.router.navigateByUrl("/pharmacy/login");
  //       }
  //     },
  //     error: (err: ErrorEvent) => {
  //       this.coreService.showError("", err.message);
  //       // if (err.message === "INTERNAL_SERVER_ERROR") {
  //       //   this.coreService.showError("", err.message);
  //       // }
  //     },
  //   });
  // }

  verifyOtp(val: any) {
    // console.log(val.currentVal);
    if (val.currentVal.length == 6) {
      let otpData = null;
      if (this.locationData.mode === "mobile") {
        otpData = {
          mobile: this.locationData.phoneNumber,
          for_portal_user: this.locationData.userId,
          otp: val.currentVal,
        };
  
        this.pharmacyService.verifyOtp(otpData).subscribe({
          next: (res) => {
            let encryptedData = { data: res };
            let response = this.coreService.decryptObjectData(encryptedData);
            console.log("verifyotp", response);
  
            if (response.status === true) {
              // console.log(":::: otp send successfully ::::")
  
              this.pharmacyService.loginUser(this.loginCreds).subscribe({
                next: (res) => {
                  let result = this.coreService.decryptObjectData({ data: res });
                  console.log("pharmacy login", result);
  
                  if (result.status === true) {
                    if (result.status == true) {
                      this.coreService.setSessionStorage(
                        result.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      }
                    if (result.errorCode === "PROFILE_NOT_APPROVED") {
                      sessionStorage.setItem(
                        "loginData",
                        JSON.stringify(result?.body?.user_details?.portalUserData)
                      );
                      sessionStorage.setItem(
                        "adminData",
                        JSON.stringify(result?.body?.user_details?.adminData)
                      );
                      this.coreService.setSessionStorage(
                        result.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      this.router.navigateByUrl("/pharmacy/createprofile");
                      this.coreService.showInfo(result.message, "");
                      return;
                    }
  
                    if (result.body.otp_verified === true) {
                      this.coreService.setSessionStorage(
                        result.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      if (
                        result.body?.user_details.portalUserData.role ===
                        "PHARMACY_ADMIN"
                      ) {
                        this.coreService.setLocalStorage(
                          result.body?.user_details.adminData,
                          "adminData"
                        );
                        this.coreService.setLocalStorage(
                          result.body?.user_details.portalUserData,
                          "loginData"
                        );

                        this.coreService.setProfileDetails(
                          result.body?.user_details.adminData.pharmacy_name
                        );
                      }
  
                      if (
                        result.body?.user_details.portalUserData.role ===
                        "PHARMACY_STAFF"
                      ) {
                        this.coreService.setLocalStorage(
                          result.body?.user_details.adminData,
                          "adminData"
                        );
                        this.coreService.setLocalStorage(
                          result.body?.user_details.portalUserData,
                          "loginData"
                        );
                        this.coreService.setProfileDetails(
                          result.body?.user_details.adminData.pharmacy_name
                        );
                      }
  
                      this.auth.setToken(result.body.token);
                      this.auth.setRole(environment.PHARMACY);
                      this.auth.setRefreshToken(result.body.refreshToken);
                      this.router.navigateByUrl("/pharmacy/dashboard");
                    }
                  } else {
                    // this.router.navigateByUrl("/pharmacy/login");
                  }
                },
              });
            } else {
              this.coreService.showError(response.message, "");
            }
          },
          error: (err: ErrorEvent) => {
            this.coreService.showError("", err.message);
          },
        });
      }
      if (this.locationData.mode === "email") {
        otpData = {
          email:this.locationData.email,
          for_portal_user: this.locationData.userId,
          otp: val.currentVal,
        };
  
        this.pharmacyService.matchEmailOtpFor2fa(otpData).subscribe({
          next: (res) => {
            let encryptedData = { data: res };
            let response = this.coreService.decryptObjectData(encryptedData);
            console.log("verifyotp", response);
  
            if (response.status === true) {
              // console.log(":::: otp send successfully ::::")
  
              this.pharmacyService.loginUser(this.loginCreds).subscribe({
                next: (res) => {
                  let result = this.coreService.decryptObjectData({ data: res });
                  console.log("pharmacy login", result);
  
                  if (result.status === true) {
                    if (result.status == true) {
                      this.coreService.setSessionStorage(
                        result.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      }
                    if (result.errorCode === "PROFILE_NOT_APPROVED") {
                      sessionStorage.setItem(
                        "loginData",
                        JSON.stringify(result?.body?.user_details?.portalUserData)
                      );
                      sessionStorage.setItem(
                        "adminData",
                        JSON.stringify(result?.body?.user_details?.adminData)
                      );
                      this.router.navigateByUrl("/pharmacy/createprofile");
                      this.coreService.showInfo(result.message, "");
                      return;
                    }
  
                    if (result.body.otp_verified === true) {
                      if (
                        result.body?.user_details.portalUserData.role ===
                        "PHARMACY_ADMIN"
                      ) {
                        this.coreService.setLocalStorage(
                          result.body?.user_details.adminData,
                          "adminData"
                        );
                        this.coreService.setLocalStorage(
                          result.body?.user_details.portalUserData,
                          "loginData"
                        );
                        this.coreService.setProfileDetails(
                          result.body?.user_details.adminData.pharmacy_name
                        );
                      }
  
                      if (
                        result.body?.user_details.portalUserData.role ===
                        "PHARMACY_STAFF"
                      ) {
                        this.coreService.setLocalStorage(
                          result.body?.user_details.adminData,
                          "adminData"
                        );
                        this.coreService.setLocalStorage(
                          result.body?.user_details.portalUserData,
                          "loginData"
                        );
                        this.coreService.setSessionStorage(
                          result.body?.user_details?.savedLogId,
                          "currentLogId"
                        );
                        this.coreService.setProfileDetails(
                          result.body?.user_details.adminData.pharmacy_name
                        );
                      }
  
                      this.auth.setToken(result.body.token);
                      this.auth.setRole(environment.PHARMACY);
                      this.auth.setRefreshToken(result.body.refreshToken);
                      this.router.navigateByUrl("/pharmacy/dashboard");
                    }
                  } else {
                    // this.router.navigateByUrl("/pharmacy/login");
                  }
                },
              });
            } else {
              this.coreService.showError(response.message, "");
            }
          },
          error: (err: ErrorEvent) => {
            this.coreService.showError("", err.message);
          },
        });
      }
    
    }
  }
}
