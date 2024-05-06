import { HospitalService } from "./../hospital.service";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/shared/auth.service";
import { Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-hospital-login",
  templateUrl: "./hospital-login.component.html",
  styleUrls: ["./hospital-login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalLoginComponent implements OnInit {
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
  password: any;
  passwordShow = false;

  @ViewChild("addsecondsubsriber", { static: false }) addsecondsubsriber: any;
  @ViewChild("hospitalpopup", { static: false }) hospitalpopup: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private _hospitalService: HospitalService,
    private _coreService: CoreService,
    private auth: AuthService,
    private toastr: ToastrService

  ) {
    let token = this.authService.isLoggedIn();
    let role = this.authService.getRole();
    if (token && role == "hospital") {
      route.navigate(["/hospital/dashboard"]);
    }

    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", [Validators.required]],
    });
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
  // onSubmit() {
  //   this.isSubmitted = true;

  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   this._hospitalService.hospitalLogin(this.loginForm.value).subscribe((res) => {
  //     try {
  //       let result = this._coreService.decryptObjectData(res);
  //       // console.log(result);return;
  //       if (result.status) {
  //         if (result.body.otp_verified === false) {
  //           this.phoneNumber =
  //             result.body.findUser.mobile;
  //           this.countryCode =
  //             result.body.findUser.country_code;
  //           this.userEmail = result.body.findUser.email;
  //           this.userId = result.body.findUser._id;
  //           this.openVerticallyCenteredsecond(this.addsecondsubsriber);
  //         }
  //         if (result.body.otp_verified === true) {
  //           this._coreService.setLocalStorage(result.body?.findUser, 'adminData');
  //           this._coreService.setLocalStorage(result.body?.findUser, 'loginData');
  //           this._coreService.setProfileDetails(result.body?.findUser.fullName);
  //           this.authService.setToken(JSON.stringify(result.body.token));
  //           this.authService.setRole('hospital');
  //           this.authService.setRefreshToken(JSON.stringify(result.body.refreshToken));
  //           this.route.navigate(['hospital/dashboard']);

  //         }

  //       } else {
  //         this._coreService.showError('Login Message', "Please Check Username and Password");
  //       }
  //     } catch (error) {
  //       this._coreService.showError('', "Please Check Username and Password");
  //       console.log(error);
  //     }
  //   }, (err: Error) => {
  //     alert(err.message);
  //   })

  // }

  onSubmit() {
    console.log("1111");
    
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("Error.")
      return;
    }
    this.isLoading = true;
    this._hospitalService.hospitalLogin(this.loginForm.value).subscribe(
      (res) => {
        try {
          // console.log("resfromlogin", res);

          let result = this._coreService.decryptObjectData({ data: res });
          console.log(result, "jhhhuhuuh");

          if (result.status) {
          
            if (result.errorCode === "PROFILE_NOT_APPROVED") {
              this._coreService.setSessionStorage(
                result.body?.user_details?.savedLogId,
                "currentLogId"
              );
              this._coreService.setLocalStorage(
                result.body?.user_details.userDetails,
                "adminData"
              );
              this._coreService.setLocalStorage(
                result.body?.user_details.portalUserData,
                "loginData"
              );
              this._coreService.setLocalStorage(
                result.body?.user_details?.staffData,
                "staffData"
              );
              
              this._coreService.setProfileDetails(
                result.body?.user_details?.userDetails?.hospital_name
              );
              // this.auth.setToken(JSON.stringify(result.body.token));
              this.auth.setRole("hospital");
              // this.auth.setRefreshToken(
              //   JSON.stringify(result.body.refreshToken)
              // );
              this.route.navigateByUrl("/hospital/createprofile");
            this._coreService.showInfo(result.message,'');
              // this.route.navigate(["hospital/createprofile"], {
              //   state: {
              //     company_name:
              //       result.body.user_details.userDetails.hospital_name,
              //     email: result.body.user_details.portalUserData.email,
              //     countryCode:
              //       result.body.user_details.portalUserData.country_code,
              //     mobileNo: result.body.user_details.portalUserData.mobile,
              //     userId: result.body.user_details.portalUserData._id,
              //   },
              // });
              // this._coreService.showInfo(result.message, "");
              return;
            }
           
            
            if (result.body.otp_verified === false) {
              this.phoneNumber = result.body.user_details.portalUserData.mobile;
              this.countryCode =
                result.body.user_details.portalUserData.country_code;
              this.userEmail = result.body.user_details.portalUserData.email;
              this.userId = result.body.user_details.portalUserData._id;
              // this.companyName = result.body.user_details.userDetails.hospital_name,
              this.openVerticallyCenteredsecond(this.addsecondsubsriber);
              return;
            }
         

            if (result.body.otp_verified === true) {
              this._coreService.setSessionStorage(
                result.body?.savedLogId,
                "currentLogId"
              );
              this._coreService.setLocalStorage(
                result.body?.user_details.userDetails,
                "adminData"
              );
              this._coreService.setLocalStorage(
                result.body?.user_details.portalUserData,
                "loginData"
              );
              this._coreService.setLocalStorage(
                result.body?.user_details?.staffData,
                "staffData"
              );
              this._coreService.setProfileDetails(
                result.body?.user_details?.userDetails?.hospital_name
              );
             
              this.auth.setToken(result.body.token);
              this.auth.setRole("hospital");
              this.auth.setRefreshToken(result.body.refreshToken);
              this.route.navigate(["/hospital/dashboard"]);
            }
          } else {
            this.isLoading = false;
            this._coreService.showError(result.message, "");
          }
        } catch (error) {
          this.isLoading = false;
          console.log("error in ins login", error);
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
      this._hospitalService.getVerificationCodeMobile(twoFaData).subscribe(
        (res: any) => {
          // console.log(res);

          let result = this._coreService.decryptObjectData({ data: res });
          // console.log(result);
          // console.log('signupmobile', result);
          if (result.status) {
            this.closePopUp();
            this.route.navigate(["/hospital/entercode"], {
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

      this._hospitalService.getVerificationCodeEmail(twoFaData).subscribe(
        (res: any) => {
          let result = this._coreService.decryptObjectData({ data: res });
          // console.log('signupemail',result);

          if (result.status) {
            this.closePopUp();
            this._coreService.showSuccess(" ", result.message);
            this.route.navigate(["/hospital/entercode"], {
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
    this.modalService.open(insurancepopup, { centered: true, size: "",backdrop:'static'  });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      HospitalService;
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
