import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../indiviual-doctor.service";

@Component({
  selector: "app-individual-doctor-forgotpass",
  templateUrl: "./individual-doctor-forgotpass.component.html",
  styleUrls: ["./individual-doctor-forgotpass.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndividualDoctorForgotpassComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  forgotPassForm: FormGroup;
  isSubmitted: boolean = false;
  response: any = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private route: Router,
  ) {
    this.forgotPassForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.isSubmitted = true;
    if (this.forgotPassForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      email: this.forgotPassForm.value.email,
    };

    this.doctorService.forgotPassword(reqData).subscribe((res) => {
      let result = this.coreService.decryptObjectData({data:res});
      console.log(result);
      if (result.status === true) {
        this.coreService.showSuccess("", result.message);
        this.route.navigate(['/individual-doctor/login'])
      }else{
        this.coreService.showError("", result.message);
      }
    });
    
  }

  get forgotFormControl(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }
}
