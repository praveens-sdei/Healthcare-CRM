import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-insurance-login',
  templateUrl: './insurance-login.component.html',
  styleUrls: ['./insurance-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InsuranceLoginComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  loginForm: FormGroup;
  loginApiRes: any;
  phoneNumber: string = "";
  countryCode: string = "";
  userEmail: string = "";
  userId: string = "";
  companyName: string = "";
  password: any;
  passwordShow = false;
  
  @ViewChild('addsecondsubsriber', { static: false }) addsecondsubsriber: any;
  constructor(
    private auth: AuthService,
    private route: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private insuranceServie: InsuranceService,
    private _coreService: CoreService) {

    let token = this.auth.isLoggedIn();
    let role = this.auth.getRole();
    if (token && role == 'insurance') {
      route.navigate(['/insurance/dashboard'])
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
      password: ['', Validators.required]
    })



  }

  ngOnInit(): void {
    sessionStorage.clear()
    this.password = 'password';
  }

  passwordClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.passwordShow = true;
    } else {
      this.password = 'password';
      this.passwordShow = false;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.insuranceServie.login(this.loginForm.value).subscribe((res) => {
      try {

        let result = this._coreService.decryptObjectData(res);
        console.log("result_____________",result);
        
        if (result.status == true) {
          this._coreService.setSessionStorage(
            result.body?.user_details?.savedLogId,
            "currentLogId"
          );
          if (result.body.otp_verified === false) {
            sessionStorage.setItem('adminId', JSON.stringify(result?.body.user_details?.portalUserData?._id))
            sessionStorage.setItem('loginCreds', JSON.stringify(this.loginForm.value))
            sessionStorage.setItem('loginData', JSON.stringify(result?.body?.user_details?.portalUserData))
            // sessionStorage.setItem('adminData', JSON.stringify(result?.body?.user_details?.adminData))

            this.phoneNumber =
              result?.body?.user_details?.portalUserData?.mobile;
            this.countryCode =
              result?.body?.user_details?.portalUserData?.country_code;
            this.userEmail = result?.body?.user_details?.portalUserData?.email;
            this.userId = result?.body?.user_details?.portalUserData?._id;
            this.companyName = result?.body?.user_details?.adminData?.company_name,
              this.openVerticallyCenteredsecond(this.addsecondsubsriber);
            return;
          }

          if (result.errorCode === "PROFILE_NOT_APPROVED") {

            sessionStorage.setItem('adminId', JSON.stringify(result?.body.user_details?.portalUserData?._id))
            sessionStorage.setItem('loginCreds', JSON.stringify(this.loginForm.value))
            sessionStorage.setItem('loginData', JSON.stringify(result?.body?.user_details?.portalUserData))
            sessionStorage.setItem('adminData', JSON.stringify(result?.body?.user_details?.adminData))

            this._coreService.showError('Profile Not Approved By Super Admin', "")

            this.route.navigate(['insurance/createprofile']);

            // this.route.navigate(['insurance/createprofile'], {
            //   state: {
            //     company_name: result?.body?.user_details?.adminData?.company_name,
            //     email: result.body?.user_details?.portalUserData?.email,
            //     countryCode: result?.body.user_details?.portalUserData?.country_code,
            //     mobileNo: result?.body?.user_details?.portalUserData?.mobile,
            //     userId: result?.body.user_details?.portalUserData?._id
            //   }
            // });
            // this._coreService.showInfo(result.message, '');
            return;

          }

          if (result.body.otp_verified === false) {

            this.phoneNumber = result?.body?.user_details?.portalUserData?.mobile;
            this.countryCode = result?.body.user_details?.portalUserData?.country_code;
            this.userEmail = result.body?.user_details?.portalUserData?.email;
            this.userId = result?.body.user_details?.portalUserData?._id;
            this.companyName = result?.body?.user_details?.adminData?.company_name;
            this.openVerticallyCenteredsecond(this.addsecondsubsriber);
          }
          // if (result.body.otp_verified === true) {

          //   this._coreService.setLocalStorage(result?.body?.user_details?.adminDetails,'adminData');
          //   this._coreService.setLocalStorage(result?.body?.user_details?.portalUserData,'loginData');
          //   this._coreService.setProfileDetails(result?.body?.user_details?.adminDetails?.company_name);
          //   this.phoneNumber =
          //   result?.body?.user_details?.portalUserData?.mobile;
          //   this.countryCode =
          //   result?.body.user_details?.portalUserData?.country_code;
          //   this.userEmail = result.body?.user_details?.portalUserData?.email;
          //   this.userId = result?.body.user_details?.portalUserData?._id;
          //   this.companyName =result?.body?.user_details?.adminData?.company_name,
          //   this.openVerticallyCenteredsecond(this.addsecondsubsriber);
          // }
          if (result.body.otp_verified === true) {

            if (result.errorCode != null) {
              this._coreService.showInfo(result.errorCode, '');
              sessionStorage.setItem('adminId', JSON.stringify(result?.body.user_details?.portalUserData?._id))
              sessionStorage.setItem('loginCreds', JSON.stringify(this.loginForm.value))
              sessionStorage.setItem('loginData', JSON.stringify(result?.body?.user_details?.portalUserData))
              sessionStorage.setItem('adminData', JSON.stringify(result?.body?.user_details?.adminData))
              this.route.navigate(['/insurance/createprofile'])
            } else {
              this._coreService.setLocalStorage(result.body?.user_details?.adminData, 'adminData');
              this._coreService.setLocalStorage(result.body?.user_details?.portalUserData, 'loginData');
              this._coreService.setProfileDetails(result.body?.user_details?.adminData?.company_name);
              this.auth.setToken(result.body.token);
              this.auth.setRole('insurance');
              this.auth.setRefreshToken(result.body.refreshToken);
              this.route.navigate(['/insurance/policyclaim']);
            }
          }

        } else {
          this.isLoading = false;

          this._coreService.showError(result.message, '');

        }
      } catch (error) {
        this.isLoading = false;

        console.log('error in ins login', error);
      }
    }, (err: Error) => {
      alert(err.message);
    })
  }

  get loginFormControl(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  openVerticallyCenteredsecond(insurancepopup: any) {
    this.modalService.open(insurancepopup, { centered: true, size: '', backdrop: 'static',keyboard: false });
  }

  // sendVerificationCode(medium: any) {

  //   let logindata = this._coreService.getLocalStorage('loginData');
  //   if (medium == 'mobile') {

  //     let twoFaData = {
  //       mobile: logindata.mobile,
  //       country_code: logindata.country_code
  //     }

  //     this.insuranceServie.getVerificationCode(twoFaData).subscribe((res: any) => {
  //       let result = this._coreService.decryptObjectData(res);
  //       // console.log('signupmobile', result);
  //       if (result.status) {
  //         this.route.navigate(['/insurance/entercode']);
  //       }
  //     }, (err: any) => {
  //       console.log(err);

  //     });


  //   } else {



  //     let twoFaData = {
  //       email: logindata.email,
  //     }
  //     this.insuranceServie.getVerificationCode(twoFaData).subscribe((res: any) => {
  //       let result = this._coreService.decryptObjectData(res);
  //       // console.log('signupemail',result);

  //       if (result.status) {
  //         this._coreService.showSuccess(" ", result.message);
  //         this.route.navigate(['/insurance/entercode']);
  //       }
  //     }, (err: any) => {
  //       console.log(err);

  //     });
  //   }

  //   // this.loginApiRes['component'] = "login";
  //   this._coreService.setSharingData(this.loginApiRes);
  //   this._coreService.setLocalStorage('login','component');
  //   this._coreService.setLocalStorage(medium,'medium');
  //   let modalDespose = this.getDismissReason(1);
  //   this.modalService.dismissAll(modalDespose);
  // }

  sendTo2fa(medium: any) {
    if (medium === 'mobile') {
      let twoFaData = {
        // mobile: this.apiResponse.mobile,
        // country_code: this.apiResponse.country_code
        email: this.userEmail
      }
      this.insuranceServie.getVerificationCodeMobile(twoFaData).subscribe((res: any) => {

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);

        if (result.status) {
          this.closePopUp();
          this.route.navigate(['/insurance/entercode'], {
            state: {
              mobile: this.phoneNumber,
              country_code: this.countryCode,
              mode: medium,
              email: this.userEmail,
              userId: this.userId,
              component: 'login',
              companyName: this.companyName,
            }
          });
        } else {
          this._coreService.showError("", result.message)
        }
      }, (err: any) => {
        console.log(err);
        this._coreService.showError("Something went wrong!", err.statusText)
      });


    }
    if (medium === 'email') {
      // this.apiResponse['medium'] = 'email';
      // console.log('in else',this.apiResponse);

      let twoFaData = {
        email: this.userEmail
      }
      this.insuranceServie.getVerificationCodeEmail(twoFaData).subscribe((res: any) => {

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);

        if (result.status) {
          this.closePopUp();
          this._coreService.showSuccess(" ", result.message);
          this.route.navigate(['/insurance/entercode'], {
            state: {
              mobile: this.phoneNumber,
              country_code: this.countryCode,
              mode: medium,
              email: this.userEmail,
              userId: this.userId,
              component: 'login',
              companyName: this.companyName,
            }
          });
        } else {
          this._coreService.showError("", result.message)
        }
      }, (err: any) => {
        console.log(err);
        this._coreService.showError("Maximum attempt exceeded", err.statusText)

      });
    }

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

}