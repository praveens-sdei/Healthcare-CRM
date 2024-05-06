import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../../insurance/insurance.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HospitalService } from '../hospital.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  selector: 'app-hospital-entercode',
  templateUrl: './hospital-entercode.component.html',
  styleUrls: ['./hospital-entercode.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HospitalEntercodeComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  isDisabled: Boolean = true;

  constructor(private _coreService: CoreService,
    private _hospitalService: HospitalService,
    private loader: NgxUiLoaderService,
    private route: Router,
    private location: Location
  ) { }

  medium: any;
  resEmail: any;
  resMobile: any;
  mode: string;
  countryCode: string = "+91";
  email: string = '';
  mobileNo: string = '';
  otpContext: string;
  userId: string;
  component: string;
  companyName: string;
  config = {
    allowNumbersOnly: true,
    length: 6,

    disableAutoFocus: false,
    placeholder: '0',
  };

  ngOnInit(): void {
    const locationInfo = this.location.getState() as ILocationData;

    this.mode = locationInfo.mode;
    this.countryCode = locationInfo.country_code;
    this.mobileNo = locationInfo.mobile;
    this.email = locationInfo.email.toLowerCase();
    this.userId = locationInfo.userId;
    this.component = locationInfo.component;
    this.companyName = locationInfo.companyName;

    if (locationInfo.mode === 'mobile') {
      this.otpContext = this.maskCharacter(
        locationInfo.country_code + locationInfo.mobile,
        "*",
        3
      );
    }

    if (locationInfo.mode === 'email') {
      this.otpContext = this.maskCharacter(locationInfo.email, "*", 3);
    }


    if (locationInfo && locationInfo.mode == undefined) {
      this.route.navigateByUrl("/hospital/login");
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
    }
    this.loader.start();
    this._hospitalService.getVerificationCodeMobile(twoFaData).subscribe((res: any) => {
      console.log(res);

      let result = this._coreService.decryptObjectData({data:res});
      console.log(result);
      // console.log('signupmobile', result);
      if (result.status) {
        this.loader.stop();
        this._coreService.showSuccess(" ", result.message);

      } else {
        this.loader.stop();
        this._coreService.showError("", result.message);

      }
    }, (err: any) => {
      this.loader.stop();
      this._coreService.showError("", err.message);
    });

  }

  private sendEmailUser() {
    let twoFaData = {
      email: this.email.toLowerCase(),
    }
    this.loader.start();
    this._hospitalService.getVerificationCodeEmail(twoFaData).subscribe((res: any) => {
      let result = this._coreService.decryptObjectData({data:res});
      // console.log('signupemail',result);

      if (result.status) {
        this.loader.stop();
        this._coreService.showSuccess(" ", result.message);

      } else {
        this.loader.stop();
        this._coreService.showError("", result.message);

      }
    }, (err: any) => {
      this.loader.stop();
      this._coreService.showError("", err.message);
      console.log(err);

    });

  }

  verifyOtp(val: any) {
    // console.log(val.currentVal);
    if (val.currentVal.length == 6) {
      let otpData = null;

      if (this.mode == 'email') {
        otpData = {
          email:this.email,
          for_portal_user: this.userId,
          otp: val.currentVal
        }
        this.loader.start();
        this._hospitalService.verifyOtpEmail(otpData).subscribe((res: any) => {

          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);
  
          if (result.status) {
            this.loader.stop();
            console.log(this.component)
            this._coreService.showSuccess(result.message, '');
            if (this.component === 'signup') {
              this.route.navigate(['hospital/createprofile'], {
                state: {
                  company_name: this.companyName,
                  email: this.email,
                  countryCode: this.countryCode,
                  mobileNo: this.mobileNo,
                  userId: this.userId
                }
              });
              return;
            }
            if (this.component === 'login') {
              this.route.navigate(['hospital/login']);
              return;
            }
  
  
          } else {
            this.loader.stop();
            this._coreService.showWarning(result.message, '')
          }
  
        }, (err: any) => {
          this.loader.stop();
          console.log('Error in verify otp', err);
          this._coreService.showError(err.statusText, "");
  
  
        })
      }

      if (this.mode == 'mobile') {
        otpData = {
          mobile:this.mobileNo,
          for_portal_user: this.userId,
          otp: val.currentVal,
        }
        this.loader.start();
        this._hospitalService.verifyOtp(otpData).subscribe((res: any) => {

          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);
  
          if (result.status) {
            this.loader.stop();
            console.log(this.component)
            this._coreService.showSuccess(result.message, '');
            if (this.component === 'signup') {
              this.route.navigate(['hospital/createprofile'], {
                state: {
                  company_name: this.companyName,
                  email: this.email,
                  countryCode: this.countryCode,
                  mobileNo: this.mobileNo,
                  userId: this.userId
                }
              });
              return;
            }
            if (this.component === 'login') {
              this.route.navigate(['hospital/login']);
              return;
            }
  
  
          } else {
            this.loader.stop();
            this._coreService.showWarning(result.message, '')
          }
  
        }, (err: any) => {
          this.loader.stop();
          console.log('error in verify otp', err);
          this._coreService.showError(err.statusText, "");
  
  
        })
      }

    

    }
  }


  onOtpChnage(event: any) {
    if (event.length == 6) {
      this.isDisabled = false
    }
  }


}
