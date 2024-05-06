import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../super-admin.service';
export interface ILocationData {
  mode: "email" | "mobile";
  mobile: string;
  country_code: string;
  email: string;
  userId:string;
}
@Component({
  selector: 'app-super-admin-entercode',
  templateUrl: './super-admin-entercode.component.html',
  styleUrls: ['./super-admin-entercode.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminEntercodeComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  isSubmitted: boolean = false;
  isDisabled: boolean = true;
  tempToken: any;
  constructor(
    private route: Router,
    private location: Location,
    private sadminService: SuperAdminService,
    private _coreService: CoreService
  ) { }

  mode: string;
  countryCode: string = "+91";
  email: string = '';
  mobileNo: string = '';
  otpContext:string;
  userId:string;
  config = {
    allowNumbersOnly: true,
    length: 6,
    disableAutoFocus: false,
    placeholder: '0',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };



  ngOnInit(): void {
    const locationInfo = this.location.getState() as ILocationData;
    console.log("DDDDDDDDDDDDDDDDD",locationInfo);

    this.mode = locationInfo.mode;
    this.countryCode = locationInfo.country_code;
    this.mobileNo = locationInfo.mobile;
    this.email = locationInfo.email;
    this.userId = locationInfo.userId;
    if(locationInfo.mode === 'mobile'){
      this.otpContext = this.maskCharacter(
        locationInfo.country_code + locationInfo.mobile,
        "*",
        3
      );
    }

    if(locationInfo.mode === 'email'){
      this.otpContext = this.maskCharacter(locationInfo.email, "*", 3);
    }
    

    if (locationInfo && locationInfo.mode == undefined) {
      this.route.navigateByUrl("/super-admin/login");
    }
  }

  maskCharacter(str: string, mask, n = 1) {
    return (
      ("" + str).slice(0, n) +
      ("" + str).slice(n, -n).replace(/./g, mask) +
      ("" + str).slice(-n)
    );
  }


  verifyOtp(val: any) {
    // console.log(val.currentVal);
    if (val.currentVal.length == 6) {
      let otpData = null;

      if (this.mode == 'email') {
        otpData = {
          email: this.email,
          otp: val.currentVal
        }

      this.sadminService.verifyEmailOtp(otpData).subscribe((res: any) => {
        console.log("res",res);
        
        let result = this._coreService.decryptObjectData({data:res});
        console.log("====>",result);

        if (result.status == true) {
          this._coreService.showSuccess(result.message, '');
          this.route.navigate(['super-admin/login']);
        } else {
          this._coreService.showWarning(result.message, '')
        }

      }, (err: any) => {
        console.log('error in verify otp', err);
        this._coreService.showWarning(err.message, '')

      })
      }

      if (this.mode == 'mobile') {
        otpData = {
          for_portal_user: this.userId,
          otp: val.currentVal,  
        }

      this.sadminService.verifyMobileOtp(otpData).subscribe((res: any) => {
        let result = this._coreService.decryptObjectData(res);
        console.log(result);

        if (result.status) {
          this._coreService.showSuccess(result.message, '');
          this.route.navigate(['super-admin/login']);
        } else {
          this._coreService.showWarning(result.message, '')
        }

      }, (err: any) => {
        console.log('error in verify otp', err);

      })
      }


    }
  }

  onOtpChange(event: any) {
    if (event.length == 6) {
      this.isDisabled = false;
    }

  }
  resendOtpDetails() {
    if (this.mode === "mobile") {
      this.sendVerificationCode("mobile");
    }
    if (this.mode === "email") {
      this.sendVerificationCode("email");
    }
  }
  sendVerificationCode(medium: any) {


    if (medium === 'mobile') {
      let twoFaData = {
        email: this.email,
      }
      // /superadmin/send-sms-otp-for-2fa
      console.log("twoFaDatatwoFaData",twoFaData);
      
      this.sadminService.getVerificationCodeMobile(twoFaData).subscribe((res: any) => {
        console.log(res);
        
        let result = this._coreService.decryptObjectData(res);
        console.log(result);
        // console.log('signupmobile', result);
        if (result.status) { 
          this._coreService.showSuccess("", result.message)         
          this.route.navigate(['/super-admin/entercode'], {
            state: {
              mobile:  this.mobileNo,
              country_code: this.countryCode,
              mode: medium,
              userId: this.userId
            }
          });
        }else{
          this._coreService.showError(result.message,'');
        }
      }, (err: any) => {
        console.log(err);
        this._coreService.showError("", err.statusText)
      });
    }

    if (medium == 'email') {
      let twoFaData = {
        email: this.email,
      }
      console.log("twoFaDatatwoFaData",twoFaData);

      this.sadminService.getVerificationCodeEmail(twoFaData).subscribe((res: any) => {
        let result = this._coreService.decryptObjectData(res);
        // console.log('signupemail',result);

        if (result.status) {
          this._coreService.showSuccess(" ", result.message);
          this.route.navigate(['/super-admin/entercode'], {
            state: {
              mobile:  this.mobileNo,
              country_code: this.countryCode,
              mode: medium,
              email: this.email,
              userId: this.userId
            }
          });
        }else{
          this._coreService.showError(result.message,'');
        }
      }, (err: any) => {
        console.log(err);
        this._coreService.showError("", err.statusText)
      });
    }

    // this.loginApiRes['component'] = "login";
    // this._coreService.setSharingData(this.loginApiRes);
    this._coreService.setLocalStorage('login', 'component');
    this._coreService.setLocalStorage(medium, 'medium');

  }
}
