import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
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
import { FourPortalService } from "src/app/modules/four-portal/four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-educational-paramedical',
  templateUrl: './educational-paramedical.component.html',
  styleUrls: ['./educational-paramedical.component.scss']
})
export class EducationalParamedicalComponent implements OnInit {

  
  @Output() fromChild = new EventEmitter<string>();
  @Input() public mstepper: MatStepper;
  educationalForm: any = FormGroup;
  isSubmitted: boolean = false;

  pageForAdd: any = true;
  educationalDetails: any;
  doctorId: any = "";

  stepper: any;

  constructor(
    private toastr: ToastrService,
    private service: FourPortalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loader: NgxUiLoaderService
  ) {
    this.educationalForm = this.fb.group({
      education: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    if (paramId === null) {
      this.pageForAdd = true;
      this.addNewEducation();
      this.doctorId = sessionStorage.getItem("doctorId")
    } else {
      this.pageForAdd = false;
      this.doctorId = paramId;
      // this.getDoctorDetails();
      this.getDoctorDetails(this.mstepper);
    }
  }

  //For Edit Doctor
  // getDoctorDetails() {
  //   this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
  //     let response = this.coreService.decryptObjectData({ data: res });
  //     this.educationalDetails =
  //       response?.data?.result[0]?.in_education?.education_details;
  //     this.patchValues(this.educationalDetails);
  //   });
  // }

  getDoctorDetails(fromParent: any) {

    let response = fromParent?.response
    this.stepper = fromParent?.mainStepper
    // this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
    //   let response = this.coreService.decryptObjectData({ data: res });
    //   this.educationalDetails =
    //     response?.data?.result[0]?.in_education?.education_details;
    //   this.patchValues(this.educationalDetails);
    // });

    this.educationalDetails =
      response?.data?.result[0]?.in_education?.education_details;
    this.patchValues(this.educationalDetails);
  }

  patchValues(data: any) {
    if (data != undefined) {
      data.forEach((element) => {
        this.addNewEducation();
      });
    } else {
      this.addNewEducation();
    }

    this.educationalForm.patchValue({
      education: data,
    });
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
      this.isSubmitted = false;
      this.loader.start();
      let reqData = {
        education_details: this.educationalForm.value.education,
        portal_user_id: this.doctorId,
        type:'Paramedical-Professions'
      };

      // console.log("REQUEST DATA==========>", reqData);

      this.service.educationalDetails(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.loader.stop();
            this.toastr.success(response.message);
            console.log("this.pageForAdd", this.pageForAdd);

            if (this.pageForAdd) {
              this.fromChild.emit("education");
            } else {
              console.log("this.pageForAdd", this.pageForAdd);

              this.stepper.next();
            }
          }
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.loader.stop();
          this.toastr.error(errResponse.message);
        }
      );
    } else {

      if (this.pageForAdd) {
        this.fromChild.emit("education");
      } else {
        console.log("this.pageForAdd", this.pageForAdd);

        this.stepper.next();
      }

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

  previousPage() {

    this.stepper.previous();
  }

  // myFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // };


}
