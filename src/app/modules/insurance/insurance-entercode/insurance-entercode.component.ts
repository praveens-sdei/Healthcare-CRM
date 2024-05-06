import { Location } from "@angular/common";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgOtpInputComponent } from "ng-otp-input";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../insurance.service";
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
  selector: "app-insurance-entercode",
  templateUrl: "./insurance-entercode.component.html",
  styleUrls: ["./insurance-entercode.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceEntercodeComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  isSubmitted: boolean = false;
  isDisabled: boolean = true;

  adminId: any = "";
  loginCreds: any;
  // tempToken: any;
  // medium: any;
  // resEmail: any;
  // resMobile: any;
  // countryCode:any;
  // component: any;
  // behaviourData: any;
  // samSub:Subscription;
  // deviceId:any='';
  // @ViewChild(NgOtpInputComponent,{static:false}) ngOtpInput:NgOtpInputComponent;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _coreService: CoreService,
    private _insuranceService: InsuranceService,
    private auth: AuthService,
    private location: Location
  ) { }

  mode: string;
  countryCode: string = "";
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

  ngOnInit(): void {
    this.adminId = JSON.parse(sessionStorage.getItem("adminId"));
    this.loginCreds = JSON.parse(sessionStorage.getItem("loginCreds"));
    const locationInfo = this.location.getState() as ILocationData;
    console.log(locationInfo);

    this.mode = locationInfo.mode;
    this.countryCode = locationInfo.country_code;
    this.mobileNo = locationInfo.mobile;
    this.email = locationInfo.email.toLowerCase();
    this.userId = locationInfo.userId;
    this.component = locationInfo.component;
    this.companyName = locationInfo.companyName;

    if (locationInfo.mode === "mobile") {      
      this.otpContext = this.maskCharacter(
        locationInfo.country_code + locationInfo.mobile,
        "*",
        3
      );
    }

    // this._coreService.setSessionStorage(locationInfo,'insData');

    if (locationInfo.mode === 'email') {
      this.otpContext = this.maskCharacter(locationInfo.email, "*", 3);
    }

    // if (locationInfo && locationInfo.mode == undefined) {
    //   this.route.navigateByUrl("/insurance/login");
    // }
  }

  maskCharacter(str: string, mask, n = 1) {
    return (
      ("" + str).slice(0, n) +
      ("" + str).slice(n, -n).replace(/./g, mask) +
      ("" + str).slice(-n)
    );
  }

  // verifyOtp(val: any) {
  //   // console.log(val.currentVal);
  //   if (val.currentVal.length == 6) {
  //     let otpData = null;

  //     if (this.medium == 'email') {
  //       otpData = {
  //         email: this.email,
  //         otp: val.currentVal
  //       }
  //     } else {
  //       otpData = {
  //         mobile: this.mobileNo,
  //         otp: val.currentVal,
  //         country_code: this.countryCode
  //       }
  //     }

  //     this._insuranceService.verifyOtp(otpData).subscribe((res: any) => {
  //       let result = this._coreService.decryptObjectData(res);
  //       console.log(result);

  //       if (result.status) {
  //         // this.auth.setToken(JSON.stringify(result.body.token));
  //         // this.auth.setRefreshToken(JSON.stringify(result.body.refreshToken));
  //         // this.auth.setRole();
  //         this._coreService.showSuccess(result.message, '');
  //         if (this.component == 'login') {

  //           this.auth.setToken(JSON.stringify(this.behaviourData.token));
  //           this.auth.setRole(this.behaviourData.role);
  //           this.auth.setRefreshToken(JSON.stringify(this.behaviourData.refreshToken));
  //           this.route.navigate(['insurance/dashboard']);
  //           return;
  //         }

  //         this.route.navigate(['insurance/createprofile']);
  //       } else {
  //         this._coreService.showWarning(result.message, '')
  //       }

  //     }, (err: any) => {
  //       console.log('error in verify otp', err);

  //     })

  //   }
  // }

  verifyOtp(val: any) {
    // console.log(val.currentVal);
    if (val.currentVal.length == 6) {
      let otpData = null;

      if (this.mode == "email") {
        otpData = {
          email:this.email,
          otp: val.currentVal,
        };

      this._insuranceService.verifyEmailOtp(otpData).subscribe(
        (res: any) => {
          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);
          console.log(result);

          if (result.status) {
            this._coreService.showSuccess(result.message, "");

            this._insuranceService.login(this.loginCreds).subscribe((res) => {
              let response = this._coreService.decryptObjectData(res);
              console.log("Login Response==>", response);

              if (response.status) {
                if (result.status == true) {
                  this._coreService.setSessionStorage(
                    response.body?.user_details?.savedLogId,
                    "currentLogId"
                  );
                  }
                if (response.errorCode === "PROFILE_NOT_APPROVED") {
                  this._coreService.showError('Profile Not Approved By Super Admin', "");
                  this._coreService.setSessionStorage(
                    response.body?.user_details?.adminData,
                    "adminData"
                  );
                  this._coreService.setSessionStorage(
                    response.body?.user_details?.portalUserData,
                    "loginData"
                  );
                  this.route.navigate(["/insurance/createprofile"]);
                  return;
                }

                if (response.body.otp_verified === true) {
                  if (response.errorCode != null) {
                    this._coreService.showInfo(response.errorCode, "");
                    this.route.navigate(["/insurance/createprofile"]);
                  } else {
                    this._coreService.setLocalStorage(
                      response.body?.user_details?.adminData,
                      "adminData"
                    );
                    this._coreService.setLocalStorage(
                      response.body?.user_details?.portalUserData,
                      "loginData"
                    );
                    this._coreService.setProfileDetails(
                      response.body?.user_details?.adminData?.company_name
                    );
                    this.auth.setToken(response.body.token);
                    this.auth.setRole("insurance");
                    this.auth.setRefreshToken(response.body.refreshToken);
                    this.route.navigate(["/insurance/policyclaim"]);
                  }
                }
              }else{
                this._coreService.showError("", response.message)
              }
            });

            // if(this.component ==='signup'){
            //   this.route.navigate(['insurance/createprofile'],{
            //     state:{
            //       company_name:this.companyName,
            //       email:this.email,
            //       countryCode:this.countryCode,
            //       mobileNo:this.mobileNo,
            //       userId:this.userId
            //     }
            //   });
            //   return;
            // }
            // if(this.component ==='login'){
            //   this.route.navigate(['insurance/login']);
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
          for_portal_user: this.userId,
          otp: val.currentVal,
        };

      this._insuranceService.verifyMobileOtp(otpData).subscribe(
        (res: any) => {
          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);
          console.log("gbsdfhgbjfd_",result);

          if (result.status == true) {
            this._coreService.showSuccess(result.message, "");

            this._insuranceService.login(this.loginCreds).subscribe((res) => {
              let response = this._coreService.decryptObjectData(res);
              console.log("Login Response==>", response);

              if (response.status == true) {
                  this._coreService.setSessionStorage(
                    response.body?.user_details?.savedLogId,
                    "currentLogId"
                  );
                if (response.errorCode === "PROFILE_NOT_APPROVED") {
                  this._coreService.showError('Profile Not Approved By Super Admin', "");
                  this._coreService.setSessionStorage(
                    response.body?.user_details?.adminData,
                    "adminData"
                  );
                  this._coreService.setSessionStorage(
                    response.body?.user_details?.portalUserData,
                    "loginData"
                  );
                  this.route.navigate(["/insurance/createprofile"]);
                  return;
                }

                if (response.body.otp_verified === true) {
                  if (response.errorCode != null) {
                    this._coreService.showInfo(response.errorCode, "");
                    this.route.navigate(["/insurance/createprofile"]);
                  } else {
                    this._coreService.setLocalStorage(
                      response.body?.user_details?.adminData,
                      "adminData"
                    );
                    this._coreService.setLocalStorage(
                      response.body?.user_details?.portalUserData,
                      "loginData"
                    );
                    this._coreService.setProfileDetails(
                      response.body?.user_details?.adminData?.company_name
                    );
                    this.auth.setToken(response.body.token);
                    this.auth.setRole("insurance");
                    this.auth.setRefreshToken(response.body.refreshToken);
                    this.route.navigate(["/insurance/policyclaim"]);
                  }
                }
              }else{
                this._coreService.showError("", response.message)
              }
            });

            // if(this.component ==='signup'){
            //   this.route.navigate(['insurance/createprofile'],{
            //     state:{
            //       company_name:this.companyName,
            //       email:this.email,
            //       countryCode:this.countryCode,
            //       mobileNo:this.mobileNo,
            //       userId:this.userId
            //     }
            //   });
            //   return;
            // }
            // if(this.component ==='login'){
            //   this.route.navigate(['insurance/login']);
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

      // this._insuranceService.verifyMobileOtp(otpData).subscribe(
      //   (res: any) => {
      //     let encryptedData = { data: res };
      //     let result = this._coreService.decryptObjectData(encryptedData);
      //     console.log(result);

      //     if (result.status) {
      //       this._coreService.showSuccess(result.message, "");

      //       this._insuranceService.login(this.loginCreds).subscribe((res) => {
      //         let response = this._coreService.decryptObjectData(res);
      //         console.log("Login Response==>", response);

      //         if (response.status) {

      //           if (response.errorCode === "PROFILE_NOT_APPROVED") {
      //             this._coreService.showError('Profile Not Approved By Super Admin', "");
      //             this.route.navigate(["/insurance/createprofile"]);
      //             return;
      //           }

      //           if (response.body.otp_verified === true) {
      //             if (response.errorCode != null) {
      //               this._coreService.showInfo(response.errorCode, "");
      //               this.route.navigate(["/insurance/createprofile"]);
      //             } else {
      //               this._coreService.setLocalStorage(
      //                 response.body?.user_details?.adminData,
      //                 "adminData"
      //               );
      //               this._coreService.setLocalStorage(
      //                 response.body?.user_details?.portalUserData,
      //                 "loginData"
      //               );
      //               this._coreService.setProfileDetails(
      //                 response.body?.user_details?.adminData?.company_name
      //               );
      //               this.auth.setToken(response.body.token);
      //               this.auth.setRole("insurance");
      //               this.auth.setRefreshToken(response.body.refreshToken);
      //               this.route.navigate(["/insurance/policyclaim"]);
      //             }
      //           }
      //         }else{
      //           this._coreService.showError("", response.message)
      //         }
      //       });

      //       // if(this.component ==='signup'){
      //       //   this.route.navigate(['insurance/createprofile'],{
      //       //     state:{
      //       //       company_name:this.companyName,
      //       //       email:this.email,
      //       //       countryCode:this.countryCode,
      //       //       mobileNo:this.mobileNo,
      //       //       userId:this.userId
      //       //     }
      //       //   });
      //       //   return;
      //       // }
      //       // if(this.component ==='login'){
      //       //   this.route.navigate(['insurance/login']);
      //       //   return;
      //       // }
      //     } else {
      //       this._coreService.showWarning(result.message, "");
      //     }
      //   },
      //   (err: any) => {
      //     console.log("error in verify otp", err);
      //   }
      // );
    }
  }

  onOtpChange(event: any) {
    if (event.length == 6) {
      this.isDisabled = false;
    }
  }


  resendOtpDetails() {
    if (this.mode === "mobile") {
      this.sendTo2fa("mobile");
    }
    if (this.mode === "email") {
      this.sendTo2fa("email");
    }
  }

  sendTo2fa(medium: any) {
    if (medium === 'mobile') {
      let twoFaData = {
        email: this.email.toLowerCase()
      }
      this._insuranceService.getVerificationCodeMobile(twoFaData).subscribe((res: any) => {

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        console.log("result", result);

        if (result.status == true) {
          this._coreService.showSuccess("",result.message)
        } else {
          this._coreService.showError("", result.message)

        }
      }, (err: any) => {
        this._coreService.showError("", err.statusText);

      });


    }
    if (medium === 'email') {

      let twoFaData = {
        email: this.email.toLowerCase()
      }
      console.log("twoFaData",twoFaData);
      
      this._insuranceService.getVerificationCodeEmail(twoFaData).subscribe((res: any) => {

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        console.log("result", result);

        if (result.status == true) {
          this._coreService.showSuccess("",result.message)
        } else {
          this._coreService.showError("", result.message)

        }
      }, (err: any) => {
        console.log(err);

      });
    }

  }
}
