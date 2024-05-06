import { InsuranceService } from "./../../../../insurance/insurance.service";
import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { Subscription } from "rxjs";

//Exclusion table data
export interface ExclusionPeriodicElement {
  exclusionname: string;
  categoryofexclusion: string;
  comment: string;
}
const EXCLUSION_ELEMENT_DATA: ExclusionPeriodicElement[] = [
  {
    exclusionname: "KING",
    categoryofexclusion: "Medicines",
    comment: "Lorem Ipsum is simply dummy text of the printing",
  },
  {
    exclusionname: "A-CERUMEN GOUTTE B/10 FACONS",
    categoryofexclusion: "Medicines",
    comment: "Lorem Ipsum is simply dummy text of the printing",
  },
  {
    exclusionname: "A-CERUMEN GOUTTE B/10 FACONS",
    categoryofexclusion: "Medicines",
    comment: "Lorem Ipsum is simply dummy text of the printing",
  },
  {
    exclusionname: "A-CERUMEN GOUTTE B/10 FACONS",
    categoryofexclusion: "Medicines",
    comment: "Lorem Ipsum is simply dummy text of the printing",
  },
];

@Component({
  selector: "app-exclusion",
  templateUrl: "./exclusion.component.html",
  styleUrls: ["./exclusion.component.scss"],
})
export class ExclusionComponent implements OnInit {
  exclusiondisplayedColumns: string[] = [
    "exclusionname",
    "categoryofexclusion",
    "comment",
    "status",
    "action",
  ];
  exclusiondataSource = EXCLUSION_ELEMENT_DATA;
  userId: any;
  editExclusionDetails!: FormGroup;
  exclusionDetailsForm!: FormGroup;
  exclusionForm!: FormGroup;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  categoryExclusion: any = [];
  searchText: any = "";
  exclusionDataId: any;
  in_exclusionId: any = "";
  exclusionSubscription:Subscription;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService
  ) {
    this.editExclusionDetails = this.fb.group({
      exclusionId: ["", [Validators.required]],
      exclusionDataId: ["", [Validators.required]],
      exclusion_inn: ["", [Validators.required]],
      brand_name: ["", [Validators.required]],
      comment: ["", [Validators.required]],
      status: [false, [Validators.required]],
      userId: [""],
    });

    this.exclusionDetailsForm = this.fb.group({
      exclusions: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
  }

  ngOnInit(): void {
    this.exclusionSubscription = this._coreService.SharingCategory.subscribe((res)=>{
      if (res != 'default') {
        this.getExclusionCategory();
      } 
    })
    this.addNewExclusion();
    this.getExclusionCategory();
    this.getExclusionDetails();
  }

  getExclusionCategory() {
    let reqData = {
      page: 1,
      limit: 10000,
      userId: this.userId,
      searchText: "",
      status: true,
    };

    this.service.listExclusions(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.categoryExclusion = response.body.result;
    });
  }

  getExclusionDetails() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
      in_exclusion: this.in_exclusionId,
    };
    this.service.listExclusionDetails(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.totalLength = response.body.totalRecords;
      this.exclusiondataSource = response.body.result;
    });
  }

  addExclusionDatils() {
    let reqData = {
      details: this.exclusionDetailsForm.value.exclusions,
      userId: this.userId,
    };

    this.service.addExclusionDetails(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.toastr.success(response.message);
        this.getExclusionDetails();
        this.closePopup();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  updateExclusionDetail() {
    this.service
      .updateExclusionDetail(this.editExclusionDetails.value)
      .subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.getExclusionDetails();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  deleteExclusionDetail() {
    this.service
      .deleteExclusionDetail(this.exclusionDataId)
      .subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.getExclusionDetails();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  handleToggleChange(event: any, data: any) {
    this.editExclusionDetails.patchValue({
      exclusionId: data?.in_exclusion,
      exclusionDataId: data?._id,
      exclusion_inn: data?.exclusion_inn,
      brand_name: data?.brand_name,
      comment: data?.comment,
      status: event.checked,
      userId: this.userId,
    });

    this.updateExclusionDetail();
  }

  closePopup() {
    this.exclusions.clear();
    this.modalService.dismissAll("close");
    this.addNewExclusion();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getExclusionDetails();
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.getExclusionDetails();
  }

  handleSelectInsurance(event: any) {
    console.log(event.value);
  }

  handleSelectExclusion(event: any) {
    if (event.value === "All") {
      this.in_exclusionId = "";
    } else {
      this.in_exclusionId = event.value;
    }
    this.getExclusionDetails();
  }

  //-------form array handling-------------
  get exclusions() {
    return this.exclusionDetailsForm.controls["exclusions"] as FormArray;
  }

  addNewExclusion() {
    this.exclusionForm = this.fb.group({
      exclusionId: ["", [Validators.required]],
      exclusion_inn: ["", [Validators.required]],
      brand_name: ["", [Validators.required]],
      comment: ["", [Validators.required]],
      status: [false, [Validators.required]],
    });
    this.exclusions.push(this.exclusionForm);
  }

  removeExclusion(index: number) {
    this.exclusions.removeAt(index);
  }

  //  Add type of service modal
  openVerticallyCenteredaddexclusion(addexclusioncontent: any) {
    this.modalService.open(addexclusioncontent, {
      centered: true,
      size: "xl",
      windowClass: "master_modal add_exclusion",
    });
  }

  //  Edit type of service modal
  openVerticallyCenterededitexclusion(editexclusioncontent: any, data: any) {
    this.editExclusionDetails.patchValue({
      exclusionId: data.in_exclusion?._id,
      exclusionDataId: data._id,
      exclusion_inn: data.exclusion_inn,
      brand_name: data.brand_name,
      comment: data.comment,
      status: data.status,
      userId: this.userId,
    });
    this.modalService.open(editexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "edit_exclusion",
    });
  }

  //Delete modal
  openVerticallyCenteredsecond(deletePopup: any, exclusionDataId: any) {
    this.exclusionDataId = exclusionDataId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  //  Choose Insurance Company modal in exclusion
  openVerticallyCenteredexclusion(chooseinsurance_excontent: any) {
    this.modalService.open(chooseinsurance_excontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal choose_insurance",
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy(): void {
    if (this.exclusionSubscription) {
      this.exclusionSubscription.unsubscribe();
    }
  }

}
