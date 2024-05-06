import { InsuranceService } from 'src/app/modules/insurance/insurance.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import Validation from "src/app/utility/validation";


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  userId: any;
  changePasswordForm: any = FormGroup;
  isSubmitted: any = false;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  constructor(
    private fb: FormBuilder,
    private coreService: CoreService,
    private sadminService: SuperAdminService,
    private toastr : ToastrService,
    private service : InsuranceService,
  ) {

    this.changePasswordForm = this.fb.group(
      {
        old_password: ["", [Validators.required]],
        new_password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            Validation.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            Validation.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            Validation.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            Validation.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true,
              }
            ),
            Validators.minLength(8),
          ]),
        ],
        confirm_password: ["", [Validators.required]],
      },
      { validators: [Validation.match("new_password", "confirm_password")] }
    );
   }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userId = loginData?._id;
  }

  handleChangePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      id: this.userId,
      old_password: this.changePasswordForm.value.old_password,
      new_password: this.changePasswordForm.value.new_password,
    };

    console.log("Request Data====>", reqData);

    this.service.changePassword(reqData).subscribe((res)=>{
      let response = this.coreService.decryptObjectData({data:res});
      console.log("Password change response===>",response)
      if(response.status === true){
        this.toastr.success(response.message)
        this.changePasswordForm.reset();
      }else{
        this.toastr.error(response.message)
      }
    },err=>{
      let errResponse = this.coreService.decryptObjectData({data:err.error});
      this.toastr.error(errResponse.message)
    })
  }

  get f() {
    return this.changePasswordForm.controls;
  }

}
