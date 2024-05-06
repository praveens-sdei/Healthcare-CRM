
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from '../super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-super-admin-forgotpass',
  templateUrl: './super-admin-forgotpass.component.html',
  styleUrls: ['./super-admin-forgotpass.component.scss']
})
export class SuperAdminForgotpassComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  forgotPassForm: FormGroup;
  responce: any = [];
  isSubmitted: boolean;
  toastr: any;
  
  constructor(
    private fb: FormBuilder, 
    private _superAdminService: SuperAdminService, 
    private _coreService:CoreService,
     private router: Router,
    
    ) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required]]
    })
  }

  get forgotFormControl(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }

  ngOnInit(): void {
  }

  onSubmit(){
    let body=this.forgotPassForm.value
    this.isSubmitted=true;
    console.log(this.forgotPassForm.value,"this.forgotPassForm.value");
    this._superAdminService.forgotPassword(body).subscribe((res) =>{
      let result = this._coreService.decryptObjectData(res);
      console.log(result)
      if(result.status === true){
        this._coreService.showSuccess('',result.message)
        this.router.navigateByUrl("/super-admin/login", {
          state: { email: this.forgotPassForm.value },
        });
      }else{

        this._coreService.showError('',result.message)
      }
    })
  }
}



