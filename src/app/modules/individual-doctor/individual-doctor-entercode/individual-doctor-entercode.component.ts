import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../indiviual-doctor.service";
export interface ILocationData {
  mode: "email" | "mobile";
  mobile: string;
  country_code: string;
  email: string;
  userId: string;
  component: string;
  companyName: string;
}

@Component({
  selector: "app-individual-doctor-entercode",
  templateUrl: "./individual-doctor-entercode.component.html",
  styleUrls: ["./individual-doctor-entercode.component.scss"],
})
export class IndividualDoctorEntercodeComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  isDisabled: Boolean = true;

  constructor(
    private _coreService: CoreService,
    private individualService: IndiviualDoctorService,
    private auth: AuthService,
    private route: Router,
    private location: Location
  ) {}

  medium: any;
  resEmail: any;
  resMobile: any;

  mode: string;
  countryCode: string = "+91";
  email: string = "";
  mobileNo: string = "";
  otpContext: string;
  userId: string;
  component: string;
  companyName: string;
  config = {
    allowNumbersOnly: true,
    length: 6,

    disableAutoFocus: false,
    placeholder: "0",
  };

  loginCreds: any;

  ngOnInit(): void {
    const locationInfo = this.location.getState() as ILocationData;
    console.log(locationInfo);
    this.loginCreds = JSON.parse(sessionStorage.getItem("loginCreds"));

    this.mode = locationInfo.mode;
    this.countryCode = locationInfo.country_code;
    this.mobileNo = locationInfo.mobile;
    this.email = locationInfo.email.toLowerCase();
    this.userId = locationInfo.userId;
    this.component = locationInfo.component;

    if (locationInfo.mode === "mobile") {
      this.otpContext = this.maskCharacter(
        locationInfo.country_code + locationInfo.mobile,
        "*",
        3
      );
    }

    if (locationInfo.mode === "email") {
      this.otpContext = this.maskCharacter(locationInfo.email, "*", 3);
    }

    if (locationInfo && locationInfo.mode == undefined) {
      this.route.navigateByUrl("/individual-doctor/login");
    }
  }

  resendOtpDetails() {
    if (this.mode === "mobile") {
      this.sendOtpUser();
    }
    if (this.mode === "email") {
      this.sendEmailUser();
    }
  }

  maskCharacter(str: string, mask, n = 1) {
    return (
      ("" + str).slice(0, n) +
      ("" + str).slice(n, -n).replace(/./g, mask) +
      ("" + str).slice(-n)
    );
  }

  private sendOtpUser() {
    let twoFaData = {
      email: this.email.toLowerCase(),
    };

    this.individualService.getVerificationCodeMobile(twoFaData).subscribe(
      (res: any) => {
        console.log(res);

        let result = this._coreService.decryptObjectData({data:res});
        console.log(result);
        // console.log('signupmobile', result);
        if (result.status) {
          this._coreService.showSuccess(" ", result.message);
        }else{
          this._coreService.showError(" ", result.message);
        }
      },
      (err: any) => {
        this._coreService.showError("", err.message);
      }
    );
  }

  private sendEmailUser() {
    let twoFaData = {
      email: this.email.toLowerCase(),
    };
    this.individualService.getVerificationCodeEmail(twoFaData).subscribe(
      (res: any) => {
        let result = this._coreService.decryptObjectData({data:res});
        // console.log('signupemail',result);

        if (result.status) {
          this._coreService.showSuccess(" ", result.message);
        }else{

          this._coreService.showError(" ", result.message);
        }
      },
      (err: any) => {
        this._coreService.showError("", err.statusText);
        console.log(err);
      }
    );
  }

  verifyOtp(val: any) {
    // console.log(val.currentVal);
    if (val.currentVal.length == 6) {
      let otpData = null;

      if (this.mode == "email") {
        otpData = {
          email:this.email,
          for_portal_user: this.userId,
          otp: val.currentVal,
        };

        console.log("otpDataotpData",otpData);

      this.individualService.verifyEmailOtp(otpData).subscribe(
        (res: any) => {
          console.log(res);

          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);
          console.log(result);

          if (result.status) {
            console.log(this.component);
            this._coreService.showSuccess(result.message, "");

            if (result.errorCode) {
              sessionStorage.setItem(
                "loginData",
                JSON.stringify(result.body?.user_details.portalUserData)
              );
              sessionStorage.setItem(
                "adminData",
                JSON.stringify(result.body?.user_details.adminData)
              );
              this._coreService.showInfo(result.errorCode, "");
              this.route.navigate(["individual-doctor/createprofile"]);
            } else {
              this.individualService
                .hospitalLogin(this.loginCreds)
                .subscribe((res) => {
                  try {
                    let response = this._coreService.decryptObjectData({
                      data: res,
                    });
                   

                    if (response.errorCode === "PROFILE_NOT_APPROVED") {
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.portalUserData,
                        "loginData"
                      );
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.adminData,
                        "adminData"
                      );
                      this._coreService.showError(response.errorCode, "");
                      this.route.navigate(["individual-doctor/createprofile"]);
                      return;
                    }

                    if (response.body.otp_verified === true) {
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      console.log("responseTTTTTTTTTT===>", response);

                      this._coreService.setLocalStorage(
                        response.body?.user_details.adminData,
                        "adminData"
                      );
                      this._coreService.setLocalStorage(
                        response.body?.user_details.portalUserData,
                        "loginData"
                      );
                      this.auth.setToken(response.body.token);
                      this.auth.setRole("individual-doctor");
                      this.auth.setRefreshToken(response.body.refreshToken);
                      this.route.navigate(["individual-doctor/dashboard"]);
                      this._coreService.showSuccess(response.message, "");
                    }
                  } catch (error) {
                    console.log("error in ins login", error);
                  }
                });
            }

            // this._coreService.showSuccess(result.message, "");
            // if (this.component === "signup") {
            //   this.route.navigate(["individual-doctor/myprofile"], {
            //     state: {
            //       company_name: this.companyName,
            //       email: this.email,
            //       countryCode: this.countryCode,
            //       mobileNo: this.mobileNo,
            //       userId: this.userId,
            //     },
            //   });
            //   return;
            // }
            // if (this.component === "login") {
            //   this.route.navigate(["individual-doctor/login"]);
            //   return;
            // }
          } else {
            this._coreService.showWarning(result.message, "");
          }
        },
        (err: any) => {
          console.log("error in verify otp", err);
        }
      );
      }

      if (this.mode == "mobile") {
        otpData = {
          mobile:this.mobileNo,
          for_portal_user: this.userId,
          otp: val.currentVal,
        };

        console.log("otpDataotpData",otpData);

      this.individualService.verifyOtp(otpData).subscribe(
        (res: any) => {
          console.log(res);

          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);
          console.log(result);

          if (result.status) {
            console.log(this.component);
            this._coreService.showSuccess(result.message, "");

            if (result.errorCode) {
              sessionStorage.setItem(
                "loginData",
                JSON.stringify(result.body?.user_details.portalUserData)
              );
              sessionStorage.setItem(
                "adminData",
                JSON.stringify(result.body?.user_details.adminData)
              );
              this._coreService.showInfo(result.errorCode, "");
              this.route.navigate(["individual-doctor/createprofile"]);
            } else {
              this.individualService
                .hospitalLogin(this.loginCreds)
                .subscribe((res) => {
                  try {
                    let response = this._coreService.decryptObjectData({
                      data: res,
                    });
                  

                    if (response.errorCode === "PROFILE_NOT_APPROVED") {
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.portalUserData,
                        "loginData"
                      );
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.adminData,
                        "adminData"
                      );
                      this._coreService.showError(response.errorCode, "");
                      this.route.navigate(["individual-doctor/createprofile"]);
                      return;
                    }

                    if (response.body.otp_verified === true) {
                      this._coreService.setSessionStorage(
                        response?.body?.user_details?.savedLogId,
                        "currentLogId"
                      );
                      console.log("responseTTTTTTTTTT===>", response);

                      this._coreService.setLocalStorage(
                        response.body?.user_details.adminData,
                        "adminData"
                      );
                      this._coreService.setLocalStorage(
                        response.body?.user_details.portalUserData,
                        "loginData"
                      );
                      this.auth.setToken(response.body.token);
                      this.auth.setRole("individual-doctor");
                      this.auth.setRefreshToken(response.body.refreshToken);
                      this.route.navigate(["individual-doctor/dashboard"]);
                      this._coreService.showSuccess(response.message, "");
                    }
                  } catch (error) {
                    console.log("error in ins login", error);
                  }
                });
            }

            // this._coreService.showSuccess(result.message, "");
            // if (this.component === "signup") {
            //   this.route.navigate(["individual-doctor/myprofile"], {
            //     state: {
            //       company_name: this.companyName,
            //       email: this.email,
            //       countryCode: this.countryCode,
            //       mobileNo: this.mobileNo,
            //       userId: this.userId,
            //     },
            //   });
            //   return;
            // }
            // if (this.component === "login") {
            //   this.route.navigate(["individual-doctor/login"]);
            //   return;
            // }
          } else {
            this._coreService.showWarning(result.message, "");
          }
        },
        (err: any) => {
          console.log("error in verify otp", err);
        }
      );
      }

    }
  }

  onOtpChnage(event: any) {
    if (event.length == 6) {
      this.isDisabled = false;
    }
  }
}
