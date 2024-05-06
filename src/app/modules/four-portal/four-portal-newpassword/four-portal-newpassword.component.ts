import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import Validation from "src/app/utility/validation";
import { FourPortalService } from "../four-portal.service";
    


@Component({
  selector: 'app-four-portal-newpassword',
  templateUrl: './four-portal-newpassword.component.html',
  styleUrls: ['./four-portal-newpassword.component.scss']
})
export class FourPortalNewpasswordComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  resetForm: FormGroup;
  isSubmitted: boolean = false;
  route_type: any;
  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private coreService: CoreService,
    private route: Router,
    private fourPortalService: FourPortalService,

  ) {
    this.resetForm = this.fb.group(
      {
        resetToken: [""],
        user_id: [""],
        password: [
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
        confirm_password: [null, [Validators.required]],
      },
      { validators: [Validation.match("password", "confirm_password")] }
    );
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
     this.route_type = params.type
     this.resetForm.patchValue({
      resetToken: params.token,
      user_id: params.user_id,  
    });
    });
  }

  setNewPassword() {
    this.isSubmitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      user_id: this.resetForm.value.user_id,
      resetToken: this.resetForm.value.resetToken,
      newPassword: this.resetForm.value.password,
      type: this.route_type
    };

    console.log("REQUEST DATA===>", reqData);

    this.fourPortalService.resetPassword(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({data:res});
        console.log(response);
        if (response.status) {
          this.toastr.success(response.message);
          this.route.navigate([`/portals/login/${this.route_type}`]);
        } else {
          this.toastr.error(response.message);
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  get f() {
    return this.resetForm.controls;
  }

  routeToLogin(){
    this.route.navigate([`/portals/login/${this.route_type}`])
  }
}
