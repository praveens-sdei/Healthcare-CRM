import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import Validation from "src/app/utility/validation";
import { HospitalService } from "../../hospital/hospital.service";
import intlTelInput from "intl-tel-input";
import { IndiviualDoctorService } from "../indiviual-doctor.service";

@Component({
  selector: "app-individual-doctor-signup",
  templateUrl: "./individual-doctor-signup.component.html",
  styleUrls: ["./individual-doctor-signup.component.scss"],
})
export class IndividualDoctorSignupComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  isSubmitted: boolean = false;
  apiResponse: any;
  errorMessage: any;
  selectedCountryCode: any = "+226";
  iti: any;
  userId: string;
  emailId: string;
  hide = true;
  hide1 = true;
  @ViewChild("addsecondsubsriber", { static: false }) addsecondsubsriber: any;
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  mobile: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder,
    private _individualService: IndiviualDoctorService,
    private _coreService: CoreService,
    private toastr: ToastrService
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
    // console.log(input);

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
    // console.log(this.signUpForm.value);
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
    };
    console.log("AAAAA", signUpData);
    
    
    this._individualService.hospitalSignup(signUpData).subscribe(
      (res: any) => {
        console.log("before decrypt", res);

        let result = this._coreService.decryptObjectData({ data: res });
        console.log("after decrypt", result);
        if (result.status) {
          this.userId = result.body.userDetails._id;
          this.emailId = result.body.userDetails.email.toLowerCase();
          this.mobile = result.body.userDetails.mobile;
          this.openVerticallyCenteredsecond(this.addsecondsubsriber);
        } else {
          this._coreService.showError(result.message, "");
          this.errorMessage = result.message;
        }
      },
      (err: any) => {
        console.log(err);
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
      this._individualService
        .getVerificationCodeMobile({ email: this.emailId.toLowerCase() })
        .subscribe(
          (res: any) => {
            let encryptedData = { data: res };
            let result = this._coreService.decryptObjectData(encryptedData);

            if (result.status) {
              this.closePopUp();
              this.router.navigate(["/individual-doctor/entercode"], {
                state: {
                  mobile: this.signUpForm.value.mobile,
                  country_code: this.selectedCountryCode,
                  mode: medium,
                  email: this.signUpForm.value.email.toLowerCase(),
                  userId: this.userId,
                  component: "signup",
                },
              });
            }
          },
          (err: any) => {
            let errorResponse = this._coreService.decryptObjectData({
              data: err.errorr,
            });
            console.log(err);
            this.toastr.error(errorResponse.message);
          }
        );
    }

    //..........for email otp verification............
    if (medium === "email") {
      this._individualService
        .getVerificationCodeEmail({ email: this.emailId.toLowerCase() })
        .subscribe(
          (res: any) => {
            let encryptedData = { data: res };
            let result = this._coreService.decryptObjectData(encryptedData);
            let userData = result.body.userData;
            console.log(userData, "userDatauserData");
            console.log("signupemail", result);

            if (result.status) {
              this.closePopUp();
              this._coreService.showSuccess(" ", result.message);
              this.router.navigate(["/individual-doctor/entercode"], {
                state: {
                  mobile: this.signUpForm.value.mobile,
                  country_code: this.selectedCountryCode,
                  mode: medium,
                  email: this.signUpForm.value.email.toLowerCase(),
                  userId: this.userId,
                  component: "signup",
                },
              });
            }
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
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
