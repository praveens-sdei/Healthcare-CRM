import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { FourPortalService } from "../four-portal.service";

export interface ILocationData {
  mode: "email" | "mobile";
  mobile: string;
  country_code: string;
  email: string;
  userId: string;
  component: string;
  companyName: string;
  type: string
}

@Component({
  selector: 'app-four-portal-entercode',
  templateUrl: './four-portal-entercode.component.html',
  styleUrls: ['./four-portal-entercode.component.scss']
})
export class FourPortalEntercodeComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  isDisabled: Boolean = true;
  route_type: any;
  constructor(
    private _coreService: CoreService,
    private auth: AuthService,
    private route: Router,
    private location: Location,
    private activateRoute: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private loader: NgxUiLoaderService

  ) { }

  medium: any;
  resEmail: any;
  resMobile: any;

  mode: string;
  countryCode: string = "";
  email: string = "";
  mobileNo: string = "";
  otpContext: string;
  userId: string;
  component: string;
  companyName: string;
  type: string
  config = {
    allowNumbersOnly: true,
    length: 6,

    disableAutoFocus: false,
    placeholder: "0",
  };

  loginCreds: any;

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });

    const locationInfo = this.location.getState() as ILocationData;
    this.loginCreds = JSON.parse(sessionStorage.getItem("loginCreds"));

    this.mode = locationInfo.mode;
    this.countryCode = locationInfo.country_code;
    this.mobileNo = locationInfo.mobile;
    this.email = locationInfo?.email.toLowerCase();
    this.userId = locationInfo.userId;
    this.component = locationInfo.component;
    this.type = locationInfo.component;

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
      this.route.navigateByUrl(`/portals/login/${this.route_type}`);
    }
  }

  resendOtpDetails() {
    if (this.mode === "mobile") {
      this.sendOtpSMSUser();
    }
    if (this.mode === "email") {
      this.sendOtpEmailUser();
    }
  }

  maskCharacter(str: string, mask, n = 1) {
    return (
      ("" + str).slice(0, n) +
      ("" + str).slice(n, -n).replace(/./g, mask) +
      ("" + str).slice(-n)
    );
  }

  private sendOtpSMSUser() {
    let twoFaData = {
      mobile: this.mobileNo,
      type: this.route_type
    };
    this.loader.start();
    this.fourPortalService.sendOtpSMS(twoFaData).subscribe(
      (res: any) => {

        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status == true) {
          this.loader.stop();
          this._coreService.showSuccess(" ", result.message);
        } else {
          this.loader.stop();
          this._coreService.showError(" ", result.message);
        }
      },
      (err: any) => {
        this.loader.stop();
        this._coreService.showError("", err.message);
      }
    );
  }

  private sendOtpEmailUser() {
    let twoFaData = {
      email: this.email.toLowerCase(),
      type: this.route_type
    };
    this.loader.start();
    this.fourPortalService.sendOtpEmail(twoFaData).subscribe(
      (res: any) => {
        let result = this._coreService.decryptObjectData({ data: res });

        if (result.status == true) {
          this.loader.stop();
          this._coreService.showSuccess(" ", result.message);
        } else {
          this.loader.stop();
          this._coreService.showError(" ", result.message);
        }
      },
      (err: any) => {
        this.loader.stop();
        this._coreService.showError("", err.statusText);
        console.log(err);
      }
    );
  }

  verifyOtp(val: any) {
    if (val.currentVal.length == 6) {
      let otpData = null;

      if (this.mode == "email") {
        otpData = {
          email: this.email,
          for_portal_user: this.userId,
          otp: val.currentVal,
          type: this.route_type
        };

        this.loader.start();
        this.fourPortalService.verifyEmailOtp(otpData).subscribe(
          (res: any) => {

            let encryptedData = { data: res };
            let result = this._coreService.decryptObjectData(encryptedData);

            if (result.status == true) {              
              if (result.errorCode) {
                this.loader.stop();
                sessionStorage.setItem(
                  "loginData",
                  JSON.stringify(result.body?.user_details.portalUserData)
                );
                sessionStorage.setItem(
                  "adminData",
                  JSON.stringify(result.body?.user_details.adminData)
                );
                this._coreService.showInfo(result.errorCode, "");

                this.route.navigate([`/portals/createprofile/${this.route_type}`]);
              } else {
                let reqData = {
                  email: this.loginCreds.email,
                  password: this.loginCreds.password,
                  type: this.route_type
                }
                this.fourPortalService
                  .fourPortalLogin(reqData)
                  .subscribe((res) => {
                    try {
                      let response = this._coreService.decryptObjectData({
                        data: res,
                      });
                      if (result.status == true) {
                      
                        }
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

                        this.route.navigate([`/portals/createprofile/${this.route_type}`]);

                        return;
                      }

                      if (response.body.otp_verified === true) {

                        this._coreService.setSessionStorage(
                          response?.body?.user_details?.savedLogId,
                          "currentLogId"
                        );
                        this._coreService.setLocalStorage(
                          response.body?.user_details.adminData,
                          "adminData"
                        );
                        this._coreService.setLocalStorage(
                          response.body?.user_details.portalUserData,
                          "loginData"
                        );
                        this.auth.setToken(response.body.token);
                        this.auth.setRole('portals');
                        this.auth.setType(this.route_type);
                        this.auth.setRefreshToken(response.body.refreshToken);
                        this.route.navigate([`/portals/dashboard/${this.route_type}`]);

                        // this.route.navigate(["individual-doctor/dashboard"]);
                        this._coreService.showSuccess(response.message, "");
                      }
                    } catch (error) {
                    }
                  });
              }

            } else {
              this.loader.stop();
              this._coreService.showWarning(result.message, "");
            }
          },
          (err: any) => {
            this.loader.stop();
          }
        );
      }

      if (this.mode == "mobile") {
        otpData = {
          mobile: this.mobileNo,
          for_portal_user: this.userId,
          otp: val.currentVal,
          type: this.route_type
        };

        this.loader.start();
        this.fourPortalService.verifyOtpSMS(otpData).subscribe(
          (res: any) => {

            let encryptedData = { data: res };
            let result = this._coreService.decryptObjectData(encryptedData);

            if (result.status) {
              this.loader.stop();
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
                this.route.navigate([`/portals/createprofile/${this.route_type}`]);

              } else {
                let reqData = {
                  email: this.loginCreds.email,
                  password: this.loginCreds.password,
                  type: this.route_type
                }
                this.fourPortalService
                  .fourPortalLogin(reqData)
                  .subscribe((res) => {
                    try {
                      let response = this._coreService.decryptObjectData({
                        data: res,
                      });
                      if (result.status == true) {
                      
                        }
                      if (response.errorCode === "PROFILE_NOT_APPROVED") {
                        this._coreService.setSessionStorage(
                          response?.body?.user_details?.portalUserData,
                          "loginData"
                        );
                        this._coreService.setSessionStorage(
                          response?.body?.user_details?.adminData,
                          "adminData"
                        );
                        this._coreService.setSessionStorage(
                          response?.body?.user_details?.savedLogId,
                          "currentLogId"
                        );
                        this._coreService.showError(response.errorCode, "");
                        this.route.navigate([`/portals/createprofile/${this.route_type}`]);

                        return;
                      }

                      if (response.body.otp_verified === true) {
                        this._coreService.setSessionStorage(
                          response?.body?.user_details?.savedLogId,
                          "currentLogId"
                        );
                        this._coreService.setLocalStorage(
                          response.body?.user_details.adminData,
                          "adminData"
                        );
                        this._coreService.setLocalStorage(
                          response.body?.user_details.portalUserData,
                          "loginData"
                        );
                        this.auth.setToken(response.body.token);
                        this.auth.setRole('portals');
                        this.auth.setType(this.route_type);
                        this.auth.setRefreshToken(response.body.refreshToken);
                        this.route.navigate([`/portals/dashboard/${this.route_type}`]);

                        this._coreService.showSuccess(response.message, "");
                      }
                    } catch (error) {
                      console.log("error in ins login", error);
                    }
                  });
              }

            } else {
              this.loader.stop();
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

  routeToLogin() {
    this.route.navigate([`/portals/login/${this.route_type}`])
  }
}

