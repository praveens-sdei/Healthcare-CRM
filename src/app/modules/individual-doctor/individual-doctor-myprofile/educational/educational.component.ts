import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { Component, OnInit, Input ,Output,EventEmitter} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";

@Component({
  selector: "app-educational",
  templateUrl: "./educational.component.html",
  styleUrls: ["./educational.component.scss"],
})
export class EducationalComponent implements OnInit {
  @Input() public mstepper: MatStepper;
  @Output() calldoctordata = new EventEmitter<string>();
  educationalForm: any = FormGroup;
  isSubmitted: boolean = false;

  pageForAdd: any = true;
  educationalDetails: any;
  doctorId: any = "";

  stepper: any;

  constructor(
    private toastr: ToastrService,
    private service: HospitalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private doctorservice:IndiviualDoctorService
  ) {
    this.educationalForm = this.fb.group({
      education: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    // if (paramId === null) {
    //   this.pageForAdd = true;
    //   this.addNewEducation();
    // } else {
    //   this.pageForAdd = false;
    //   this.doctorId = paramId;
    //   this.getDoctorDetails();
    // }
    this.calldoctordata.emit();
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorId = loginData?._id;
    this.getDoctorDetails(this.mstepper);
  }

  //For Edit Doctor
  getDoctorDetails(fromParent: any) {
    let response = fromParent?.response
    this.stepper = fromParent?.mainStepper
    // this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
    //   let response = this.coreService.decryptObjectData({ data: res });
    //   this.educationalDetails =
    //     response?.data?.result[0]?.in_education?.education_details;
    //   this.patchValues(this.educationalDetails);
    // });

    this.doctorservice.getData().subscribe((data:any) => {
      console.log("data_________",data)
      this.educationalDetails =
      data?.response?.data?.result[0]?.in_education?.education_details;
      console.log("this.educationalDetails)",this.educationalDetails);
      this.patchValues(this.educationalDetails);
      });
   
      
  }

  patchValues(data: any) {
    if (data) {
      data.forEach((element) => {
        this.addNewEducation();
      });
      this.educationalForm.patchValue({
        education: data,
      });
    } else {
      this.addNewEducation();
    }
  }


  hasValueInFields(row: AbstractControl, filedarray: Array<any>): boolean {
    let newarray = false;
    console.log("filedarray", filedarray);

    filedarray.forEach(element => {
      if (row.get(element).value) {
        newarray = true;
      }
    });
    console.log(newarray, "dghfhdfjjf");

    // const field1Value = row.get('field1').value;
    // const field2Value = row.get('field2').value;
    // Add more fields as needed

    return newarray; // Return true if any field has a value
  }

  handleSave() {
    this.isSubmitted = true;
    // if (this.educationalForm.invalid) {
    //   console.log("================INVALID==================");
    //   return;
    // }

    const rowEducational = this.educationalForm.get("education") as FormArray;
    if (
      (rowEducational.controls.some(row => this.hasValueInFields(row, ['degree', 'university', 'city', 'country', 'start_date', 'end_date'])))

    ) {
      console.log("1reqDate");
      this.isSubmitted = false;
      this.loader.start();
      let reqData = {
        education_details: this.educationalForm.value.education,
        portal_user_id: this.doctorId,
      };
      // console.log("REQUEST DATA==========>", reqData);
      this.service.educationalDetails(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.loader.stop();
            this.toastr.success(response.message);
            this.stepper.next();
          } else {
            this.loader.stop();
            this.toastr.error(response.message);
          }
        },

      );
    } else {
      console.log("1reqDate");
      this.stepper.next();

    }
  }

  //-----------FORM ARRAY HANDLING-------------
  validation(index) {
    let abc = this.educationalForm.get("education") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get education() {
    return this.educationalForm.controls["education"] as FormArray;
  }

  addNewEducation() {
    console.log("data33333333")
    const newMedicalAct = this.fb.group({
      degree: [""],
      university: [""],
      city: [""],
      country: [""],
      start_date: [""],
      end_date: [""],
    });
    this.education.push(newMedicalAct);
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  previousPage() {
    this.stepper.previous();
  }
}
