import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/shared/auth.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import { PharmacyService } from "../pharmacy.service";
import { ILoginRequest, ILoginResponse } from "./pharmacy-login.type";

@Component({
  selector: "app-pharmacy-login",
  templateUrl: "./pharmacy-login.component.html",
  styleUrls: ["./pharmacy-login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PharmacyLoginComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  phoneNumber: string = "";
  countryCode: string = "";
  userId: string = "";
  emailId: string = "";
  password: any;
  passwordShow = false;
  isSubmitted: any = false;
  
  @ViewChild("twofapopup", { static: false }) twofapopup: any;

  public loginFields: FormGroup = new FormGroup(
    {
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$"),
      ]),
      keep_signin: new FormControl("",),
    },
    { validators: [] }
  );

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private auth: AuthService
  ) { }

  openVerticallyCenteredsecond(twofapopup: any) {
    this.modalService.open(twofapopup, { centered: true, size: "",backdrop: 'static',keyboard: false });
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

  ngOnInit(): void {
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

  private getLoginField(field: string) {
    return this.loginFields.get(field).value;
  }

  public loginUser(): void {
    this.isSubmitted = true;
    if (this.loginFields.invalid) {
      return;
    }
    this.isSubmitted = false;

    const loginRequest: ILoginRequest = {
      email: this.getLoginField("email"),
      password: this.getLoginField("password"),
    };
    this.pharmacyService.loginUser(loginRequest).subscribe({
      next: (res) => {

        // console.log(result);
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
        console.log('pharmacy login', result);
        if(result.status === false){
          this.coreService.showWarning(result.message,'')
        }

        if (result.status === true) {
          // this.coreService.showSuccess(result.message,'');
          this.userId = result.body.user_details.portalUserData._id;
          this.coreService.setSessionStorage(
            result.body?.user_details?.savedLogId,
            "currentLogId"
          );
          console.log("result.body====>",result.body);
          
          sessionStorage.setItem("portal-user-id", this.userId);
          this.coreService.setSessionStorage(result.body.user_details.portalUserData,'portalData');
          if (result.errorCode === "PROFILE_NOT_APPROVED") {
            console.log("PROFILE_NOT_APPROVED");

            sessionStorage.setItem('loginData',JSON.stringify(result?.body?.user_details?.portalUserData))
            sessionStorage.setItem('adminData',JSON.stringify(result?.body?.user_details?.adminData))
            this.router.navigateByUrl("/pharmacy/createprofile");
            this.coreService.showInfo(result.message,'');
            return;
          }
          if (result.body.otp_verified === false) {
            console.log("False");
            
            sessionStorage.setItem('loginCreds',JSON.stringify({email:this.loginFields.value.email,password:this.loginFields.value.password}))
            sessionStorage.setItem('loginData',JSON.stringify(result?.body?.user_details?.portalUserData))
            sessionStorage.setItem('adminData',JSON.stringify(result?.body?.user_details?.adminData))
            this.phoneNumber =
              result.body.user_details.portalUserData.phone_number;
            this.countryCode =
              result.body.user_details.portalUserData.country_code;
            this.emailId =
              result.body.user_details.portalUserData.email;
            this.openVerticallyCenteredsecond(this.twofapopup);
          }
          if (result.body.otp_verified === true) {

          console.log("TRUE");
          
            
            if(result.body?.user_details.portalUserData.role ==="PHARMACY_ADMIN"){
              this.coreService.setLocalStorage(result.body?.user_details.adminData, 'adminData');
              this.coreService.setLocalStorage(result.body?.user_details.portalUserData, 'loginData');
              this.coreService.setProfileDetails(result.body?.user_details.adminData.pharmacy_name);
            }
            
            if(result.body?.user_details.portalUserData.role ==="PHARMACY_STAFF"){
              this.coreService.setLocalStorage(result.body?.user_details.adminData, 'adminData');
              this.coreService.setLocalStorage(result.body?.user_details.portalUserData, 'loginData');
              this.coreService.setProfileDetails(result.body?.user_details.adminData.pharmacy_name);
            }
            
            this.auth.setToken(result.body.token);
            this.auth.setRole(environment.PHARMACY);
            this.auth.setRefreshToken(result.body.refreshToken);
            this.router.navigateByUrl("/pharmacy/dashboard");
          }
        }else{
          this.coreService.showError(result.message,'');
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
          //  this.coreService.showError("", err.message);
        // }
      },
    });
  }

  public gotoVerification(mode: "email" | "mobile"): void {
    if (mode === "email") {
      this.router.navigateByUrl("/pharmacy/entercode", {
        state: {
          email: this.getLoginField("email"),
          userId: this.userId,
          mode,
        },
      });
    }
    if (mode === "mobile") {
      this.router.navigateByUrl("/pharmacy/entercode", {
        state: {
          email: this.emailId,
          phoneNumber: this.phoneNumber,
          countryCode: this.countryCode,
          userId: this.userId,
          mode,
        },
      });
    }
    this.modalService.dismissAll();
  }
}