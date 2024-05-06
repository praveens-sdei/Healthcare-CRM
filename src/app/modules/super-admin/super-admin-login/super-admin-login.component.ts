import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { CoreService } from 'src/app/shared/core.service';
import { environment } from 'src/environments/environment';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-super-admin-login',
  templateUrl: './super-admin-login.component.html',
  styleUrls: ['./super-admin-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminLoginComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  loginForm: FormGroup;
  phoneNumber: string;
  countryCode: string;
  userEmail: string;
  userId: string;
  password: any;
  passwordShow = false;

  @ViewChild('addsecondsubsriber', { static: false }) addsecondsubsriber: any;
  constructor(private modalService: NgbModal,
    private fb: FormBuilder, private authService: AuthService, private route: Router,
    private _sadminservice: SuperAdminService, private _coreService: CoreService) {

    let token = this.authService.isLoggedIn();
    let role = this.authService.getRole();
    if (token && role == environment.SUPERADMIN) {
      route.navigate(['/super-admin/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.email,
      Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
      password: ['', [Validators.required]]
    })

  }

  ngOnInit(): void {
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
    console.log('on submit', this.loginForm.value);

    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this._sadminservice.login(this.loginForm.value).subscribe((res) => {
      try {
        let result = this._coreService.decryptObjectData(res);
        console.log(result, 'loggedIn data');
        if (result.status) {
          this._coreService.setSessionStorage(
            result.body?.savedLogId,
            "currentLogId"
          );
          if (result.body.otp_verified === false) {
            this.phoneNumber =
              result.body.findUser.mobile;
            this.countryCode =
              result.body.findUser.country_code;
            this.userEmail = result.body.findUser.email;
            this.userId = result.body.findUser._id;
            this.openVerticallyCenteredsecond(this.addsecondsubsriber);
          }

          if (result.body.otp_verified === true) {
            this._coreService.setLocalStorage(result.body?.adminData, 'adminData');

            this._coreService.setLocalStorage(result.body?.findUser, 'loginData');
            this._coreService.setProfileDetails(result.body?.findUser.fullName);
            this.authService.setToken(result.body.token);
            this.authService.setRole('super-admin');
            this.authService.setRefreshToken(result.body.refreshToken);
            if (result.body?.findUser.role == "ASSOCIATION_USER") {
              this.route.navigate(['super-admin/medicineclaim']);
            }
            else {
              this.route.navigate(['super-admin/dashboard']);
            }


          }

        } else {
          this._coreService.showError('Login Message', result.message);
        }
      } catch (error) {
        this._coreService.showError('', error);
        console.log(error);
      }
    }, (err: Error) => {
      alert(err.message);
    })

  }
  get loginFormControl(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
  sendVerificationCode(medium: any) {


    if (medium === 'mobile') {
      let twoFaData = {
        email: this.userEmail,
      }
      // /superadmin/send-sms-otp-for-2fa
      this._sadminservice.getVerificationCodeMobile(twoFaData).subscribe((res: any) => {
        console.log(res);

        let result = this._coreService.decryptObjectData(res);
        console.log(result);
        // console.log('signupmobile', result);
        if (result.status) {
          this.closePopUp();
          this._coreService.showSuccess(" ", result.message);
          this.route.navigate(['/super-admin/entercode'], {
            state: {
              mobile: this.phoneNumber,
              country_code: this.countryCode,
              mode: medium,
              userId: this.userId,
              email: this.userEmail
            }
          });
        } else {
          this._coreService.showError(result.message, '');
        }
      }, (err: any) => {
        console.log(err);
      });
    }

    if (medium == 'email') {



      let twoFaData = {
        email: this.userEmail,
      }
      console.log('signupemail', twoFaData);

      this._sadminservice.getVerificationCodeEmail(twoFaData).subscribe((res: any) => {
        console.log('signupemail', res);

        let result = this._coreService.decryptObjectData(res);
        console.log('signupemail', result);

        if (result.status) {
          this.closePopUp();
          this._coreService.showSuccess(" ", result.message);
          this.route.navigate(['/super-admin/entercode'], {
            state: {
              mobile: this.phoneNumber,
              country_code: this.countryCode,
              mode: medium,
              email: this.userEmail,
              userId: this.userId
            }
          });
        } else {
          this._coreService.showError(result.message, '');
        }
      }, (err: any) => {
        console.log(err);

      });
    }

    // this.loginApiRes['component'] = "login";
    // this._coreService.setSharingData(this.loginApiRes);
    this._coreService.setLocalStorage('login', 'component');
    this._coreService.setLocalStorage(medium, 'medium');

  }

  private closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  openVerticallyCenteredsecond(insurancepopup: any) {
    this.modalService.open(insurancepopup, { centered: true, size: '',backdrop:'static' });
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
}