import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../indiviual-doctor.service";

@Component({
  selector: "app-individual-doctor-login",
  templateUrl: "./individual-doctor-login.component.html",
  styleUrls: ["./individual-doctor-login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndividualDoctorLoginComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  isSubmitted: boolean = false;
  isLoading: boolean = false;
  loginForm: FormGroup;
  phoneNumber: string;
  countryCode: string;
  userEmail: string;
  userId: string;
  emailId: string;
  errorMessage: any;
  companyName: string = "";

  @ViewChild("addsecondsubsriber", { static: false }) addsecondsubsriber: any;
  password: any;
  passwordShow = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private individualService: IndiviualDoctorService,
    private _coreService: CoreService,
    private auth: AuthService
  ) {
    let token = this.authService.isLoggedIn();
    let role = this.authService.getRole();
    if (token && role == "individual-doctor") {
      route.navigate(["/individual-doctor/dashboard"]);
    }

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      keep_signin: [""],
    });
  }

  ngOnInit(): void {
    //console.log("test");
    sessionStorage.clear();
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
    this.individualService.hospitalLogin(this.loginForm.value).subscribe(
      (res) => {
        try {
          let result = this._coreService.decryptObjectData({ data: res });
          console.log(result, "result");

          if (result.status) {
            this.userId = result?.body?.user_details?.portalUserData._id;
            sessionStorage.setItem("portal-user-id", this.userId);

            this._coreService.setSessionStorage(
              result?.body?.user_details?.savedLogId,
              "currentLogId"
            );
            this._coreService.setSessionStorage(
              result?.body?.user_details?.portalUserData,
              "loginData"
            );
            this._coreService.setSessionStorage(
              result?.body?.user_details?.adminData,
              "adminData"
            );
            sessionStorage.setItem(
              "loginCreds",
              JSON.stringify(this.loginForm.value)
            );

            if (result.errorCode === "PROFILE_NOT_APPROVED") {
              this._coreService.showError('Profile not approved by superadmin', "");
              this.isLoading = false;
              this.isSubmitted = false;
              // this._coreService.showInfo(result.message, "");
              this.route.navigate(["individual-doctor/createprofile"]);
              return;
            }

            if (result.body.otp_verified === false) {
              this.phoneNumber = result.body.user_details.portalUserData.mobile;
              this.countryCode =
                result.body.user_details.portalUserData.country_code;
              this.userEmail = result.body.user_details.portalUserData.email;
              this.userId = result.body.user_details.portalUserData._id;
              //this.companyName = result.body.user_details.userDetails.hospital_name,
              this.openVerticallyCenteredsecond(this.addsecondsubsriber);
              return;
            }

            if (result.body.otp_verified === true) {
              console.log("RESULTTTTTTTTTTT===>", result);

              if (result?.errorCode != null) {
                sessionStorage.setItem(
                  "loginData",
                  JSON.stringify(result.body?.user_details.portalUserData)
                );
                sessionStorage.setItem(
                  "adminData",
                  JSON.stringify(result.body?.user_details.adminData)
                );
                sessionStorage.setItem(
                  "loginCreds",
                  JSON.stringify(this.loginForm.value)
                );
                this._coreService.showInfo(result.message, '')
                this.route.navigate(["individual-doctor/createprofile"]);
              } else {
                this._coreService.setLocalStorage(
                  result.body?.user_details.adminData,
                  "adminData"
                );
                this._coreService.setLocalStorage(
                  result.body?.user_details.portalUserData,
                  "loginData"
                );
                //  this._coreService.setProfileDetails(result.body?.user_details?.userDetails?.hospital_name);
                this.auth.setToken(result.body.token);
                this.auth.setRole("individual-doctor");
                this.auth.setRefreshToken(result.body.refreshToken);
                this.route.navigate(["individual-doctor/dashboard"]);
              }
            }
          } else {
            this.isLoading = false;
            this._coreService.showError(result.message, "");
          }
        } catch (error) {
          this.isLoading = false;
          console.log("error in ins login", error);
          this._coreService.showError(error.statusText, "");

        }
      },
      (err: Error) => {
        alert(err.message);
      }
    );
  }

  sendVerificationCode(medium: any) {
    if (medium === "mobile") {
      let twoFaData = {
        email: this.userEmail,
      };
      // superadmin/send-sms-otp-for-2fa
      this.individualService.getVerificationCodeMobile(twoFaData).subscribe(
        (res: any) => {
          console.log(res);

          let result = this._coreService.decryptObjectData({ data: res });
          console.log(result);
          // console.log('signupmobile', result);
          if (result.status) {
            this.closePopUp();
            this.route.navigate(["/individual-doctor/entercode"], {
              state: {
                mobile: this.phoneNumber,
                country_code: this.countryCode,
                mode: medium,
                email: this.userEmail,
                userId: this.userId,
                component: "login",
                companyName: this.companyName,
              },
            });
          } else {
            this._coreService.showError(result.message, "");
          }
        },
        (err: any) => {
          console.log(err);
          this._coreService.showError(err.statusText, "");

        }
      );
    }

    if (medium == "email") {
      let twoFaData = {
        email: this.userEmail,
      };

      this.individualService.getVerificationCodeEmail(twoFaData).subscribe(
        (res: any) => {
          let result = this._coreService.decryptObjectData({ data: res });
          console.log("RESPONSE+======>", result);

          if (result.status) {
            this.modalService.dismissAll("close");
            this.closePopUp();
            this._coreService.showSuccess(" ", result.message);
            this.route.navigate(["/individual-doctor/entercode"], {
              state: {
                mobile: this.phoneNumber,
                country_code: this.countryCode,
                mode: medium,
                email: this.userEmail,
                userId: this.userId,
                component: "login",
                companyName: this.companyName,
              },
            });
          } else {
            this._coreService.showError(result.message, "");
          }
        },
        (err: any) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this._coreService.showError("", errResponse.message);
          console.log(err);
        }
      );
    }

    this._coreService.setLocalStorage("login", "component");
    this._coreService.setLocalStorage(medium, "medium");
  }

  private closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  get loginFormControl(): { [key: string]: AbstractControl } {
    // console.log(this.loginForm.controls);
    return this.loginForm.controls;
  }

  openVerticallyCenteredsecond(insurancepopup: any) {
    this.modalService.open(insurancepopup, { centered: true, size: "",backdrop: 'static' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
