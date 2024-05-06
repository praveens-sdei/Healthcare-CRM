import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../pharmacy.service";
import { IRegisterRequest, IRegisterResponse } from "./pharmacy-signup.type";
import { customFieldValidator } from "./pharmacy-signup.validator";
import intlTelInput from "intl-tel-input";
import { PharmacyPlanService } from "../pharmacy-plan.service";
@Component({
  selector: "app-pharmacy-signup",
  templateUrl: "./pharmacy-signup.component.html",
  styleUrls: ["./pharmacy-signup.component.scss"],
})
export class PharmacySignupComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  userId: string = "";
  selectedCountryCode: any = "+226";
  iti: any;
  hide1 = true;
  hide = true;
  @ViewChild("twofapopup", { static: false }) twofapopup: any;
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  isSubmitted: any = false;

  public registrationFields: FormGroup = new FormGroup(
    {
      user_name: new FormControl(""
      ),
      first_name: new FormControl("", [Validators.required]),
      middle_name: new FormControl(""),
      last_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      country_code: new FormControl("+226", [Validators.required]),
      phone_number: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+?\d+$/),
      ]),
      pharmacy_name: new FormControl("", Validators.required),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$"),
      ]),
      confirm_password: new FormControl("", [Validators.required]),
      accept_terms: new FormControl(false, [Validators.required]),
    },
    { validators: [customFieldValidator] }
  );

  ngOnInit(): void { }

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private _pharService: PharmacyPlanService
  ) { }

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

  openVerticallyCenteredsecond(twofapopup: any) {
    this.modalService.open(twofapopup, {
      centered: true,
      backdrop: "static",
      size: "",
    });
  }
  openVerticallyCenteredseconD(terms: any) {
    this.modalService.open(terms, {
      centered: true,
      backdrop: "static",
      size: "",
    });
  }

  private getRegistrationField(field: string) {
    return this.registrationFields.get(field).value;
  }

  private getFieldTouched(field: string) {
    return (
      this.registrationFields.get(field).touched ||
      this.registrationFields.get(field).dirty
    );
  }

  public customValidatorError(field: string, customValidatorField: string) {
    return (
      this.getFieldTouched(field) &&
      this.registrationFields.errors &&
      this.registrationFields.errors?.[customValidatorField]
    );
  }

  public signup(): void {
    this.isSubmitted = true;
    if (this.registrationFields.invalid) {
      return;
    }
    this.isSubmitted = false;
    const registrationRequest: IRegisterRequest = {
      email: this.getRegistrationField("email").toLowerCase(),
      password: this.getRegistrationField("password"),
      country_code: this.selectedCountryCode,
      // country_code: this.getRegistrationField("country_code"),
      pharmacy_name: this.getRegistrationField("pharmacy_name"),
      phone_number: this.getRegistrationField("phone_number"),
      user_name: this.getRegistrationField("first_name") + " " + this.getRegistrationField("middle_name") + " " + this.getRegistrationField("last_name"),
      first_name: this.getRegistrationField("first_name"),
      middle_name: this.getRegistrationField("middle_name"),
      last_name: this.getRegistrationField("last_name"),

    };
    console.log("registrationRequest", registrationRequest);
    this._pharService.signUp(registrationRequest).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
        console.log("pharmacy signup", result);
        // this.coreService.showSuccess("", "Registration Successful");
        if (result.status === true) {
          this.userId = result.data.user_details.portalUserData._id;
          sessionStorage.setItem("portal-user-id", this.userId);
          this.openVerticallyCenteredsecond(this.twofapopup);
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  public gotoVerification(mode: "email" | "mobile"): void {
    sessionStorage.setItem(
      "loginCreds",
      JSON.stringify({
        email: this.registrationFields.value.email,
        password: this.registrationFields.value.password,
      })
    );

    if (mode === "email") {
      this.router.navigateByUrl("/pharmacy/entercode", {
        state: {
          email: this.getRegistrationField("email"),
          userId: this.userId,
          mode,
        },
      });
    }
    if (mode === "mobile") {
      this.router.navigateByUrl("/pharmacy/entercode", {
        state: {
          email: this.getRegistrationField("email"),
          phoneNumber: this.getRegistrationField("phone_number"),
          countryCode: this.selectedCountryCode,
          userId: this.userId,
          mode,
        },
      });
    }
    this.modalService.dismissAll();
  }
}
