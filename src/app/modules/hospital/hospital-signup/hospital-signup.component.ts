import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Validation from '../../../utility/validation';
import { HospitalService } from '../../hospital/hospital.service';
import { CoreService } from 'src/app/shared/core.service';
import intlTelInput from 'intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { twoDigits } from 'mat-timepicker/lib/util';
@Component({
  selector: 'app-hospital-signup',
  templateUrl: './hospital-signup.component.html',
  styleUrls: ['./hospital-signup.component.scss']
})
export class HospitalSignupComponent implements OnInit {

  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  signUpForm: FormGroup;
  isSubmitted: boolean = false;
  apiResponse: any;
  errorMessage: any;
  selectedCountryCode: any = "+226";
  iti: any;
  userId: string;
  emailId: string;
  hide1 = true;
  hide = true;
  @ViewChild('hospitalpopup', { static: false }) hospitalpopup: any
  @ViewChild('phone') phone: ElementRef<HTMLInputElement>;
  mobile: any;

  constructor(private router: Router,
    private fb: FormBuilder, private modalService: NgbModal,
    private _hospitalService: HospitalService, private _coreService: CoreService,private toastr : ToastrService) {

    this.signUpForm = this.fb.group({
      fullname: [''],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      hospitalName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\+?\d+$/)]],
      password: [
        null,
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          Validation.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          Validation.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          Validation.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          Validation.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
      ],
      confirmPassword: ['', Validators.required],
      termsCondition: ['', Validators.required]
    },
      { validators: [Validation.match('password', 'confirmPassword')] }
    );
  }

  openVerticallyCenteredsecond(hospitalpopup: any) {
    this.modalService.open(hospitalpopup, {
      centered: true, size: '', backdrop: 'static',
      keyboard: false
    });
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

  ngOnInit(): void {
  }

  /*
  code for country code starts
  */
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  }
  ngAfterViewInit() {
    const input = this.phone.nativeElement;
    // console.log(input);

    // const input = document.querySelector("#phone");
    this.iti = intlTelInput(input, {
      initialCountry: "BF",
      separateDialCode: true
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
      this.toastr.error("All fields are required.")
      return;
    }
    let signUpData = {
      full_name: this.signUpForm.value.first_name+' '+this.signUpForm.value.middle_name+' '+this.signUpForm.value.last_name,
      first_name: this.signUpForm.value.first_name,
      middle_name: this.signUpForm.value.middle_name,
      last_name: this.signUpForm.value.last_name,
      email: this.signUpForm.value.email.toLowerCase(),
      mobile: this.signUpForm.value.mobile,
      hospital_name: this.signUpForm.value.hospitalName,
      password: this.signUpForm.value.password,
      country_code: this.selectedCountryCode
    }
    // console.log(signUpData);
    this._hospitalService.hospitalSignup(signUpData).subscribe((res: any) => {

      let result = this._coreService.decryptObjectData({data: res});
      // console.log('SIGNUP RESPONSE====>', result);
      if (result.status) {
        localStorage.setItem('loginData',JSON.stringify(result?.body?.userData));
        localStorage.setItem('adminData',JSON.stringify(result?.body?.adminData));
        // localStorage.setItem('staffData',JSON.stringify(result?.body?.adminData));


        this.userId = result.body.userData._id;
        // console.log(result.body.adminData)
        this.emailId = result.body.userData.email;
        this.mobile = result.body.userData.mobile
        ;

        // console.log(this.emailId,"email")s
        this.openVerticallyCenteredsecond(this.hospitalpopup);

      } else {
        this._coreService.showError(result.message, '');
        this.errorMessage = result.message;
      }
    }, (err: any) => {
      console.log(err);

    });

  }


  get hospitalFormControl(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  sendTo2fa(medium: any) {
    if (medium === 'mobile') {
      // this.apiResponse['medium'] = 'mobile';


      let twoFaData = {
        email: this.emailId.toLowerCase()
      }
      // console.log(twoFaData)
      this._hospitalService.getVerificationCodeMobile({email:this.emailId}).subscribe((res: any) => {
        // console.log("--->",res);

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        // console.log('signupmobile', result);

        if (result.status) {
          this.closePopUp();
          this.router.navigate(['/hospital/entercode'], {
            state: {
              mobile: this.signUpForm.value.mobile,
              country_code: this.selectedCountryCode,
              mode: medium,
              email: this.signUpForm.value.email.toLowerCase(),
              userId: this.userId,
              component: 'signup',
              companyName: this.signUpForm.value.hospitalName,
            }
          });
        }
      }, (err: any) => {
        let errorResponse = this._coreService.decryptObjectData({ data: err.errorr })
        // console.log(err)
        this.toastr.error(errorResponse.message)
      });
    }

    //..........for email otp verification............
    if (medium === 'email') {

      let twoFaData = {
        email: this.emailId.toLowerCase()
      }
      // console.log("twoFaData",twoFaData)
      this._hospitalService.getVerificationCodeEmail({email: this.emailId.toLowerCase()}).subscribe((res: any) => {
        // console.log(res);

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        let userData = result.body.userData
        // console.log(userData, "userDatauserData")
        // console.log('signupemail', result);

        if (result.status) {
          this.closePopUp();
          this._coreService.showSuccess(" ", result.message);
          this.router.navigate(['/hospital/entercode'], {
            state: {
              mobile: this.signUpForm.value.mobile,
              country_code: this.selectedCountryCode,
              mode: medium,
              email: this.signUpForm.value.email.toLowerCase(),
              userId: this.userId,
              component: 'signup',
              companyName: this.signUpForm.value.hospitalName,
            }
          });
        }
      }, (err: any) => {
        console.log(err);

      });
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
