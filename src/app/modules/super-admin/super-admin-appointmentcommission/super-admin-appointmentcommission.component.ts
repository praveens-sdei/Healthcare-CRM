import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminService } from "../super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/shared/auth.service";

@Component({
  selector: "app-super-admin-appointmentcommission",
  templateUrl: "./super-admin-appointmentcommission.component.html",
  styleUrls: ["./super-admin-appointmentcommission.component.scss"],
})
export class SuperAdminAppointmentcommissionComponent implements OnInit {
  individualDoctorForm!: FormGroup;
  hospitaDoctorForm!: FormGroup;
  adminId: any = "";
  isSubmittedHospital:boolean=false;
  isSubmittedIndividual:boolean=false;
  userRole: any;
  loginId: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private coreService: CoreService,
    private router: Router,
    private toastr: ToastrService,
    private sadminService: SuperAdminService,
    private auth: AuthService
  ) {
    this.individualDoctorForm = this.fb.group({
      _id: [""],
      type: ["individual_doctor"],
      online: this.fb.group({
        flat_fee: ["",[Validators.required, Validators.min(0)]],
        percentage_fee: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      home_visit: this.fb.group({
        flat_fee: ["",[Validators.required, Validators.min(0)]],
        percentage_fee: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      face_to_face: this.fb.group({
        flat_fee: ["",[Validators.required, Validators.min(0)]],
        percentage_fee: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      for_user:[''],
      createdBy:['']

    });

    this.hospitaDoctorForm = this.fb.group({
      _id: [""],
      type: ["hospital_doctor"],
      online: this.fb.group({
        flat_fee: ["",[Validators.required, Validators.min(0)]],
        percentage_fee: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      home_visit: this.fb.group({
        flat_fee: ["",[Validators.required, Validators.min(0)]],
        percentage_fee: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      face_to_face: this.fb.group({
        flat_fee: ["",[Validators.required, Validators.min(0)]],
        percentage_fee: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      for_user:[''],
      createdBy:['']
    });
  }

  ngOnInit(): void {
    let loginData = this.coreService.getLocalStorage("loginData");
    const userAdminData = this.coreService.getLocalStorage('adminData')

    this.loginId = loginData?._id;
    this.userRole = loginData?.role;

    if(this.userRole === 'STAFF_USER'){
      this.adminId = userAdminData?.for_staff
    }else{
      this.adminId = this.loginId
    }


    this.individualDoctorForm.get('for_user').setValue(this.adminId);
    this.hospitaDoctorForm.get('for_user').setValue(this.adminId);

    this.individualDoctorForm.get('createdBy').setValue(this.loginId);
    this.hospitaDoctorForm.get('createdBy').setValue(this.loginId);


    this.getAppointmentCommisions();
  }

  getAppointmentCommisions() {
    let reqData = {
      for_user: this.adminId,
    };

    this.sadminService.getAppointmentCommissions(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          response?.body?.forEach((element) => {
            if (element?.type === "individual_doctor") {
              this.individualDoctorForm.patchValue(element);
            } else {
              this.hospitaDoctorForm.patchValue(element);
            }
          });
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.erro,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  saveCommission(saveFor: any) {
    let reqData = {};

    if (saveFor === "hospital_doctor") {
      this.isSubmittedHospital = true
      if(this.hospitaDoctorForm.invalid){
        return;
      }
      this.isSubmittedHospital = true
      reqData = this.hospitaDoctorForm.value;
    } else {
      this.isSubmittedIndividual=true
      if(this.individualDoctorForm.invalid){
        return;
      }
      this.isSubmittedIndividual=false
      reqData = this.individualDoctorForm.value;
    }

    console.log("REQ DATA===>", reqData);   

    this.sadminService.saveCommission(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.toastr.success(response.message);
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.erro,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }
}
