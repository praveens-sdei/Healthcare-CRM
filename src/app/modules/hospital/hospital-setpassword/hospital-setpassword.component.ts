import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';
import Validation from 'src/app/utility/validation';
import { customFieldValidator } from './hospital-setnewpass.validator';

@Component({
  selector: 'app-hospital-setpassword',
  templateUrl: './hospital-setpassword.component.html',
  styleUrls: ['./hospital-setpassword.component.scss']
})
export class HospitalSetpasswordComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  resetForm: FormGroup;
  submitted: boolean = false;
  password: any;
  confirmPassword: any;
  
  constructor(private fb: FormBuilder,
    private route: Router,
    private toastr: ToastrService,
    private _hospitalService: HospitalService,
    private activatedRoute: ActivatedRoute,
    private _coreService: CoreService) {
      this.resetForm = this.fb.group(
        {
          resetToken: [""],
          user_id: [""],
          newPassword: ['', [ Validators.required,
            Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$"),]],
          confirmPassword: ['', [Validators.required]]
        },
        { validators: [customFieldValidator]}
      );

     }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        console.log(params)
        this.resetForm.patchValue({
          resetToken: params.token,
          user_id: params.user_id
        })
      }
      );
  }

  setNewPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return
    }
    let reqData = {
      user_id: this.resetForm.value.user_id,
      resetToken: this.resetForm.value.resetToken,
      newPassword: this.resetForm.value.newPassword,
    };
    
    // const data = this.resetForm.value
    this._hospitalService.setNewPassword(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});
      console.log(response)
      if (response.status) {
        this.toastr.success(response.message)
        this.route.navigate(["/hospital/login"]);
      } else {
        this.toastr.error(response.message)
      }
    })
  }

  get resetFormControl(): { [key: string]: AbstractControl } {
    return this.resetForm.controls;
  }
  
  private getFieldTouched(field: string) {
    return (
      this.resetForm.get(field).touched ||
      this.resetForm.get(field).dirty
    );
  }

  public customValidatorError(field: string, customValidatorField: string) {
    return (
      this.getFieldTouched(field) &&
      this.resetForm.errors &&
      this.resetForm.errors?.[customValidatorField]
    );
  }
}
