import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import Validation from "src/app/utility/validation";
import intlTelInput from "intl-tel-input";
import { FourPortalService } from "../four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { start } from "repl";


@Component({
  selector: 'app-four-portal-signup',
  templateUrl: './four-portal-signup.component.html',
  styleUrls: ['./four-portal-signup.component.scss']
})
export class FourPortalSignupComponent implements OnInit {

  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  isSubmitted: boolean = false;
  apiResponse: any;
  errorMessage: any;
  selectedCountryCode: any = "+226";
  iti: any;
  userId: string;
  emailId: string;
  hide1 = true;
  hide = true;
  
  @ViewChild("addsecondsubsriber", { static: false }) addsecondsubsriber: any;
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  mobile: any;
  route_type: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private loader: NgxUiLoaderService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private fourPortalService: FourPortalService,


  ) { }

  openVerticallyCenteredsecond(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, {
      centered: true,
      size: "",
      backdrop: "static",
      keyboard: false,
    });
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

  public signUpForm: FormGroup = new FormGroup(
    {
      fullname: new FormControl(""),
      first_name: new FormControl("", [Validators.required]),
      middle_name: new FormControl(""),
      last_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      mobile: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+?\d+$/)

      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$"),
      ]),
      confirmPassword: new FormControl("", [Validators.required]),
      termsCondition: new FormControl(false, [Validators.required]),
    },
    { validators: [Validation.match("password", "confirmPassword")] }
  );

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });
    sessionStorage.clear();

  }

  /*
 code for country code starts
 */
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
  ngAfterViewInit() {
    const input = this.phone.nativeElement;

    // const input = document.querySelector("#phone");
    this.iti = intlTelInput(input, {
      initialCountry: "BF",
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
  }
  /*
    code for country code ends
  */

  onSubmit() {
    this.isSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    let signUpData = {
      full_name: this.signUpForm.value.first_name+' '+this.signUpForm.value.middle_name+' '+this.signUpForm.value.last_name,
      first_name: this.signUpForm.value.first_name,
      middle_name: this.signUpForm.value.middle_name,
      last_name: this.signUpForm.value.last_name,
      email: this.signUpForm.value.email.toLowerCase(),
      mobile: this.signUpForm.value.mobile,
      password: this.signUpForm.value.password,
      country_code: this.selectedCountryCode,
      type : this.route_type
    };
    
    this.loader.start();
    this.fourPortalService.fourPortalSignup(signUpData).subscribe(
      (res: any) => {

        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status == true) {
          this.loader.stop();
          this.userId = result.body.userDetails._id;
          this.emailId = result.body.userDetails.email.toLowerCase();
          this.mobile = result.body.userDetails.mobile;
          this._coreService.showSuccess(result.message, "");

          this.openVerticallyCenteredsecond(this.addsecondsubsriber);
        } else {
          this.loader.stop();
          this._coreService.showError(result.message, "");
          this.errorMessage = result.message;
        }
      },
      (err: any) => {
        this.loader.stop();
      }
    );
  }

  get hospitalFormControl(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  sendTo2fa(medium: any) {
    sessionStorage.setItem(
      "loginCreds",
      JSON.stringify({
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      })
    );
    if (medium === "mobile") {
      this.loader.start();
      this.fourPortalService
        .sendOtpSMS({ mobile: this.mobile, type:this.route_type }).subscribe(
          (res: any) => {
            let encryptedData = { data: res };
            let result = this._coreService.decryptObjectData(encryptedData);

            if (result.status) {
              this.loader.stop();
              this.closePopUp();
              this.router.navigate([`/portals/entercode/${this.route_type}`], {
                state: {
                  mobile: this.signUpForm.value.mobile,
                  country_code: this.selectedCountryCode,
                  mode: medium,
                  email: this.signUpForm.value.email.toLowerCase(),
                  userId: this.userId,
                  component: "signup",
                },
              });
            }else{
              this.loader.stop();

            }
          },
          (err: any) => {
            let errorResponse = this._coreService.decryptObjectData({
              data: err.errorr,
            });
            this.loader.stop();
            console.log(err);
            this.toastr.error(errorResponse.message);
          }
        );
    }

 
    if (medium === "email") {
      this.loader.start();
      this.fourPortalService
        .sendOtpEmail({ email: this.emailId.toLowerCase(), type:this.route_type })
        .subscribe(
          (res: any) => {
            let encryptedData = { data: res };
            let result = this._coreService.decryptObjectData(encryptedData);
            let userData = result.body.userData;           

            if (result.status) {
              this.loader.stop();
              this.closePopUp();
              this._coreService.showSuccess(" ", result.message);
              this.router.navigate([`/portals/entercode/${this.route_type}`], {
                state: {
                  mobile: this.signUpForm.value.mobile,
                  country_code: this.selectedCountryCode,
                  mode: medium,
                  email: this.signUpForm.value.email.toLowerCase(),
                  userId: this.userId,
                  component: "signup",
                },
              });
            }else{
              this.loader.stop();
            }
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  routeToLogin(){
    this.router.navigate([`/portals/login/${this.route_type}`])
  }

  closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  openVerticallyCenteredterms(termsofuse: any) {
    this.modalService.open(termsofuse, {
      centered: true,
      size: "md",
      windowClass: "new_invite",
    });
  }
}
