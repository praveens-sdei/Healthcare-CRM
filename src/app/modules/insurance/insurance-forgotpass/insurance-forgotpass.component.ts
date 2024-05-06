import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../insurance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-forgotpass',
  templateUrl: './insurance-forgotpass.component.html',
  styleUrls: ['./insurance-forgotpass.component.scss']
})
export class InsuranceForgotpassComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  forgotPassForm: FormGroup;
  isSubmitted: boolean;
  
  constructor(
    private fb: FormBuilder,
    private _insuranceService:InsuranceService,
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
    this._insuranceService.forgotPassword(body).subscribe((res) =>{
      let result = this._coreService.decryptObjectData(res);
      console.log(result)
      if(result.status === true){
        this.router.navigateByUrl("/insurance/login", {
          state: { email: this.forgotPassForm.value },
        });
        this._coreService.showSuccess('',result.message)
      }else{
        this._coreService.showError('',result.message)
      }
    })
  }
  
}



