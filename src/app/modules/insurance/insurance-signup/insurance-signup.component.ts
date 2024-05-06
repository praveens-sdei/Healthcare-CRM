import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import Validation from "../../../utility/validation";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { InsuranceService } from "../insurance.service";
import { CoreService } from "src/app/shared/core.service";

import intlTelInput from "intl-tel-input";
@Component({
  selector: "app-insurance-signup",
  templateUrl: "./insurance-signup.component.html",
  styleUrls: ["./insurance-signup.component.scss"],
})
export class InsuranceSignupComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  signUpForm: FormGroup;
  isSubmitted: boolean = false;
  apiResponse: any;
  errorMessage: any;
  admindetails: any;
  iti: any;
  selectedCountryCode: any = "+226";
  childData: any;
  userId: string;
  emailId: string;
  @ViewChild("insurancepopup", { static: false }) insurancepopup: any;
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  hide = true;
  hide1 = true;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService
  ) {
    this.signUpForm = this.fb.group(
      {
        fullname: [""],
        first_name: ["", [Validators.required]],
        middle_name: [""],
        last_name: ["", [Validators.required]],

        email: [
          "",
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              "[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})"
            ),
          ],
        ],
        insuranceName: ["", Validators.required],
        mobile: ["", [Validators.required, Validators.pattern(/^\+?\d+$/)]],
        // mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$"),
          ],
        ],
        confirmPassword: ["", Validators.required],
        termsCondition: [false, Validators.required],
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
  }

  openVerticallyCenteredsecond(insurancepopup: any) {
    this.modalService.open(insurancepopup, {
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

  ngOnInit(): void {}
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
    if (this.signUpForm.invalid || this.signUpForm.value.termsCondition === false) {
      return;
    }

    let signUpData = {
      full_name: this.signUpForm.value.first_name+" "+this.signUpForm.value.middle_name+" "+this.signUpForm.value.last_name,
      first_name: this.signUpForm.value.first_name,
      middle_name: this.signUpForm.value.middle_name,
      last_name: this.signUpForm.value.last_name,
      email: this.signUpForm.value.email.toLowerCase(),
      mobile: this.signUpForm.value.mobile,
      company_name: this.signUpForm.value.insuranceName,
      password: this.signUpForm.value.password,
      country_code: this.selectedCountryCode,
    };

    // console.log(signUpData);
    this._insuranceService.addInsSuperAdmin(signUpData).subscribe(
      (res: any) => {

        let result = this._coreService.decryptObjectData(res);
        if (result.status) {
          this._coreService.showSuccess(result.message, "");
          this.userId = result.body.userDetails._id;
          this.emailId = result.body.userDetails.email;
          sessionStorage.setItem('adminId',JSON.stringify(result.body.userDetails._id))
          this.openVerticallyCenteredsecond(this.insurancepopup);
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

  get insuranceFormControl(): { [key: string]: AbstractControl } {
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
      // this.apiResponse['medium'] = 'mobile';

      let twoFaData = {
        // mobile: this.apiResponse.mobile,
        // country_code: this.apiResponse.country_code
        email: this.emailId,
      };
      this._insuranceService.getVerificationCodeMobile(twoFaData).subscribe(
        (res: any) => {

          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);

          if (result.status) {
            this.closePopUp();
            this.router.navigate(["/insurance/entercode"], {
              state: {
                mobile: this.signUpForm.value.mobile,
                country_code: this.selectedCountryCode,
                mode: medium,
                email: this.signUpForm.value.email,
                userId: this.userId,
                component: "signup",
                companyName: this.signUpForm.value.insuranceName,
              },
            });
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    if (medium === "email") {
      // this.apiResponse['medium'] = 'email';
      // console.log('in else',this.apiResponse);

      let twoFaData = {
        email: this.emailId,
      };
      this._insuranceService.getVerificationCodeEmail(twoFaData).subscribe(
        (res: any) => {

          let encryptedData = { data: res };
          let result = this._coreService.decryptObjectData(encryptedData);

          if (result.status) {
            this.closePopUp();
            this._coreService.showSuccess(" ", result.message);
            this.router.navigate(["/insurance/entercode"], {
              state: {
                mobile: this.signUpForm.value.mobile,
                country_code: this.selectedCountryCode,
                mode: medium,
                email: this.signUpForm.value.email,
                userId: this.userId,
                component: "signup",
                companyName: this.signUpForm.value.insuranceName,
              },
            });
          }
        },
        (err: any) => {
          this._coreService.showError("", err.statusText)
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
