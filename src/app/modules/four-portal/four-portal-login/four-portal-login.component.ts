import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FourPortalService } from "../four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-four-portal-login',
  templateUrl: './four-portal-login.component.html',
  styleUrls: ['./four-portal-login.component.scss']
})
export class FourPortalLoginComponent implements OnInit {
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
  route_type: any;
  password: any;
  passwordShow = false;
  
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _coreService: CoreService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private loader: NgxUiLoaderService


  ) {
 

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      keep_signin: [""],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });
    let token = this.authService.isLoggedIn();
    let role = this.authService.getRole();
    if (token && role == "portals") {
      this.router.navigate([`/portals/dashboard/${this.route_type}`]);
    }
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

    let reqData ={
      email:this.loginForm.value.email,
      password:this.loginForm.value.password,
      type:this.route_type
    }
    this.loader.start();
    this.isLoading = true;
    this.fourPortalService.fourPortalLogin(reqData).subscribe(
      (res) => {
        try {
          let result = this._coreService.decryptObjectData({ data: res });

          if (result.status == true) {
            this.loader.stop();
            this._coreService.setSessionStorage(
              result?.body?.user_details?.savedLogId,
              "currentLogId"
            );
            this.userId = result?.body?.user_details?.portalUserData._id;
            sessionStorage.setItem("portal-user-id", this.userId);
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
            this.auth.setRole('portals');
            this.auth.setType(this.route_type);

            if (result.errorCode === "PROFILE_NOT_APPROVED") {
              this._coreService.showError('Profile not approved by superadmin', "");
              this.isLoading = false;
              this.isSubmitted = false;
              this._coreService.showInfo(result.message, "");
              this.router.navigate([`/portals/createprofile/${this.route_type}`]);

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
                this.auth.setRole('portals');
                this.auth.setType(this.route_type);
                this._coreService.showInfo(result.message, '')
                this.router.navigate([`/portals/createprofile/${this.route_type}`]);        
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
                this.auth.setRole('portals');
                this.auth.setType(this.route_type);
                this.auth.setRefreshToken(result.body.refreshToken);
                this.router.navigate([`/portals/dashboard/${this.route_type}`]);
              }
            }

            
          } else {
            this.loader.stop();
            this.isLoading = false;
            this._coreService.showError(result.message, "");
          }
        } catch (error) {
          this.loader.stop();
          this.isLoading = false;
          this._coreService.showError(error.statusText, "");

        }
      },
      (err: Error) => {
        this.loader.stop();
        alert(err.message);
      }
    );
  }

  sendVerificationCode(medium: any) {
    if (medium === "mobile") {
      let twoFaData = {
        mobile: this.phoneNumber, type:this.route_type 
      };
      // superadmin/send-sms-otp-for-2fa
      this.loader.start();
      this.fourPortalService.sendOtpSMS(twoFaData).subscribe(
        (res: any) => {

          let result = this._coreService.decryptObjectData({ data: res });
          if (result.status) {
            this.loader.stop();
            this._coreService.showSuccess(result.message, "");

            this.closePopUp();
            this.router.navigate([`/portals/entercode/${this.route_type}`], {
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
            this.loader.stop();
            this._coreService.showError(result.message, "");
          }
        },
        (err: any) => {
          this.loader.stop();          
          this._coreService.showError(err.statusText, "");

        }
      );
    }

    if (medium == "email") {
      let twoFaData = {
        email: this.userEmail,
        type:this.route_type
      };
      this.loader.start();
      this.fourPortalService.sendOtpEmail(twoFaData).subscribe(
        (res: any) => {
          let result = this._coreService.decryptObjectData({ data: res });

          if (result.status == true) {
            this.loader.stop();
            this.modalService.dismissAll("close");
            this.closePopUp();
            this._coreService.showSuccess(" ", result.message);
            this.router.navigate([`/portals/entercode/${this.route_type}`], {
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
            this.loader.stop();
            this._coreService.showError(result.message, "");
          }
        },
        (err: any) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this.loader.stop();
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
    return this.loginForm.controls;
  }

  openVerticallyCenteredsecond(insurancepopup: any) {
    this.modalService.open(insurancepopup, { centered: true, size: "",backdrop:'static'});
  }


  routeToSingup(){
    this.router.navigate([`/portals/signup/${this.route_type}`])

  }

  routeToForgotpass(){
    this.router.navigate([`/portals/forgotpass/${this.route_type}`])
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

