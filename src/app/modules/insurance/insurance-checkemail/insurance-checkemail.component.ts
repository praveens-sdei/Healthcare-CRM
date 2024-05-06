import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../insurance.service';
export interface ILocationData {
  mode: "email" | "mobile";
  mobile: string;
  country_code: string;
  email: string;
  userId: string;
  component: string;
  companyName: string;
}
@Component({
  selector: 'app-insurance-checkemail',
  templateUrl: './insurance-checkemail.component.html',
  styleUrls: ['./insurance-checkemail.component.scss']
})
export class InsuranceCheckemailComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  email: string = "";



  constructor(
    private _insuranceService: InsuranceService,
    private _coreService: CoreService, private location: Location, private router: Router,) { }

  ngOnInit(): void {
    const locationInfo = this.location.getState() as ILocationData;
    if (locationInfo && locationInfo.email === undefined) {
      this.router.navigateByUrl("/insurance/login");
    } else {
      this.email = locationInfo.email;
    }
  }

  sendEmailUser() {
    this._insuranceService.forgotPassword(this.email).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      console.log(result)
      if (result.status === true) {

      } else {
        this._coreService.showError('', result.message)
      }
    })
  }
}
