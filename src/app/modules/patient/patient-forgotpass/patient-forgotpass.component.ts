import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-forgotpass',
  templateUrl: './patient-forgotpass.component.html',
  styleUrls: ['./patient-forgotpass.component.scss']
})
export class PatientForgotpassComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  forgotPassForm: FormGroup;
  isSubmitted: boolean = false;
  response: any = [];

  constructor(private fb: FormBuilder, private _patientservice: PatientService, private _coreService: CoreService, private router: Router,) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required]]
    })
  }

  get forgotFormControl(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }


  ngOnInit(): void {
  }

  onSubmit() {
    // console.log("Called")
    this._patientservice.forgotPassword(this.forgotPassForm.value).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      if (result.status === true) {
        this.router.navigateByUrl("/patient/login", {
          state: { email: this.forgotPassForm.value },
        });
        this._coreService.showSuccess('', result.message)
      } else {
        console.log("result.message",result.message);
        
        this._coreService.showError('', result.message)
      }
    })

  }
}



