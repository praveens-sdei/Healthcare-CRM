import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { FourPortalService } from "src/app/modules/four-portal/four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-documentmanage-lab-imaging',
  templateUrl: './documentmanage-lab-imaging.component.html',
  styleUrls: ['./documentmanage-lab-imaging.component.scss']
})
export class DocumentmanageLabImagingComponent implements OnInit {


  @Output() fromChild = new EventEmitter<string>();
  @Input() public mstepper: MatStepper;
  documentManagementForm!: FormGroup;
  isSubmitted: any = false;

  pageForAdd: any = true;
  doctorId: any = "";
  docDetails: any;
  hospitalId: any = "";

  stepper:any;

  constructor(
    private fb: FormBuilder,
    private _hospitalService: HospitalService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private fourportal: FourPortalService,
    private loader: NgxUiLoaderService
  ) {
    this.documentManagementForm = this.fb.group({
      document: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.hospitalId = loginData?._id;
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    if (paramId === null) {
      this.pageForAdd = true;
      this.addForm();
      this.stepper = this.mstepper;
      this.doctorId = sessionStorage.getItem("doctorId")
    } else {
      this.pageForAdd = false;
      this.doctorId = paramId;
      this.getDoctorDetails(this.mstepper);
    }
  }

  //For Edit Doctor
  // getDoctorDetails() {
  //   this._hospitalService
  //     .getDoctorProfileDetails(this.doctorId)
  //     .subscribe((res) => {
  //       let response = this._coreService.decryptObjectData({ data: res });
  //       this.docDetails =
  //         response?.data?.result[0]?.in_document_management?.document_details;
  //       this.patchValues(this.docDetails);
  //     });
  // }

  getDoctorDetails(fromParent: any) {

    let response = fromParent?.response;
    this.stepper = fromParent?.mainStepper;
    // this.docDetails =
    //       response?.data?.result[0]?.in_document_management?.document_details;
    this.docDetails =
    response?.data?.documentManagementList[0]?.document_details;
        this.patchValues(this.docDetails);
  }

  patchValues(data: any) {
    if (data) {
      data.forEach((element) => {
        this.addForm();
      });
    } else {
      this.addForm();
    }

    this.documentManagementForm.patchValue({
      document: data,
    });
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  savebuttonHandler() {
    this.isSubmitted = true;
    if (this.documentManagementForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      document_details: this.documentManagementForm.value.document,
      portal_user_id: this.doctorId,
      type: 'Laboratory-Imaging'
    };

    console.log("REQUEST DATA========>", reqData);

    this.fourportal.documentManage(reqData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("RESPONSE========>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          if (this.pageForAdd) {
            this.fromChild.emit("docs");
          } else {
            this.stepper.next();
          }
        }
      },
      (err) => {
        let errResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  documentValidation(index) {
    let document = this.documentManagementForm.get("document") as FormArray;
    const formGroup = document.controls[index] as FormGroup;
    return formGroup;
  }
  get document() {
    return this.documentManagementForm.controls["document"] as FormArray;
  }

  addForm() {
    const newDocument = this.fb.group({
      doc_name: [""],
      issue_date: [""],
      expiration_date: [""],
      image_url: [""],
    });
    this.document.push(newDocument);
  }

  deleteForm(index: number) {
    this.document.removeAt(index);
  }

  onFileSelected(event: any, index: number) {
    let file = event.target.files[0];

    const formData: FormData = new FormData();
    formData.append("portal_user_id", this.hospitalId);
    formData.append("docType", "licence");
    formData.append("documents", file);
    formData.append("portalType", "Laboratory-Imaging");

    this.fourportal.uploadFileForPortal(formData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });

        console.log(response);

        this.document.at(index).patchValue({
          image_url: response.data[0],
        });
      },
      (err) => {
        let errResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.messgae);
      }
    );
  }

  previousPage() {
    this.stepper.previous();
  }
}
