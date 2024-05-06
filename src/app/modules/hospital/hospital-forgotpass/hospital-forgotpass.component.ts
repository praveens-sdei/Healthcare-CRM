import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-hospital-forgotpass',
  templateUrl: './hospital-forgotpass.component.html',
  styleUrls: ['./hospital-forgotpass.component.scss']
})
export class HospitalForgotpassComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  forgotPassForm: FormGroup;
  isSubmitted: boolean = false;
  response: any = [];

  constructor(
    private fb: FormBuilder,
    private _hospitalservice: HospitalService,
    private _coreService: CoreService,
    private route: Router,
    private loader: NgxUiLoaderService,
  ) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {

    let body = this.forgotPassForm.value
    this.isSubmitted = true;
    console.log(this.forgotPassForm.value, "this.forgotPassForm.value");
    this.loader.start();
    this._hospitalservice.forgotPassword(body).subscribe((res) => {
      let result = this._coreService.decryptObjectData({data:res});
      console.log(result)
      if (result.status === true) {
        this.loader.stop();
        this._coreService.showSuccess('', result.message);
        this.route.navigate(['/hospital/login'])

      } else {
        this.loader.stop();
        this._coreService.showError("", result.message);
      }
    })
  }


  get forgotFormControl(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }

}

