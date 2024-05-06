import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../super-admin.service';
import { customFieldValidator } from './superadmin-newpassword.validator';

@Component({
  selector: 'app-super-admin-newpassword',
  templateUrl: './super-admin-newpassword.component.html',
  styleUrls: ['./super-admin-newpassword.component.scss']
})
export class SuperAdminNewpasswordComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  resetForm: FormGroup;
  submitted: boolean = false;
  password: any;
  confirmPassword: any;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _superAdminService: SuperAdminService,
    private activatedRoute: ActivatedRoute,
    private _coreService: CoreService,
    private router: Router,
  ) {
    this.resetForm = this.fb.group({
      resetToken: [''],
      user_id: [''],
      newPassword: ['', [Validators.required,
      Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$"),]],
      confirmPassword: ['', [Validators.required]]
    },
      { validators: [customFieldValidator] })

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        console.log("ABC=======>", params)
        this.resetForm.patchValue({
          resetToken: params.token,
          user_id: params.user_id
        })
      }
      );
  }

  setNewPassword() {
    console.log(this.resetForm.value)
    this.submitted = true;
    if (this.resetForm.invalid) {
      return
    }

    // const data = this.resetForm.value
    this._superAdminService.setNewPassword(this.resetForm.value).subscribe((res) => {

      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.toastr.success(response.message)
        this.router.navigateByUrl('/super-admin/login');
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

