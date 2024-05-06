import { InsuranceService } from "./../../../../insurance/insurance.service";
import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

// Category of Exclusion table data
export interface catexclusionPeriodicElement {
  categoryofexclusion: string;
}
const CATEXCLUSION_ELEMENT_DATA: catexclusionPeriodicElement[] = [
  { categoryofexclusion: "Cosmetics and Hygiene Products" },
];

@Component({
  selector: "app-category-of-exclusion",
  templateUrl: "./category-of-exclusion.component.html",
  styleUrls: ["./category-of-exclusion.component.scss"],
})
export class CategoryOfExclusionComponent implements OnInit {
  // Category of Exclusion table data
  catexclusiondisplayedColumns: string[] = [
    "categoryofexclusion",
    "status",
    "action",
  ];
  catexclusiondataSource = CATEXCLUSION_ELEMENT_DATA;

  userId: any;
  editExclusion!: FormGroup;
  addExclusionForm!: FormGroup;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  exclusionId: any = "";
  searchText: any = "";

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService
  ) {
    this.editExclusion = this.fb.group({
      exclusionId: [""],
      name: ["", [Validators.required]],
      status: [false, [Validators.required]],
    });

    this.addExclusionForm = this.fb.group({
      exclusions: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
  }

  ngOnInit(): void {
    this.addNewExclusion();
    this.getExclusionList();
  }

  getExclusionList() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
    };

    this.service.listExclusions(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response.body.totalRecords;
      this.catexclusiondataSource = response.body.result;
    });
  }

  addExclusion() {
    let reqData = {
      exclusions: this.addExclusionForm.value.exclusions,
      userId: this.userId,
    };

    this.service.addExclusion(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.toastr.success(response.message);
        this.getExclusionList();
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  updateExclusion() {
    this.service
      .updateExclusion(this.editExclusion.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.getExclusionList();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  deleteExclusion() {
    this.service.deleteExclusion(this.exclusionId).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.getExclusionList();
        this.toastr.success(response.message);
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handleToggleChange(data: any, event: any) {
    this.editExclusion.patchValue({
      exclusionId: data?._id,
      name: data?.name,
      status: event?.checked,
    });
    this.updateExclusion();
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.getExclusionList();
  }

  handleSelectInsurance(event: any) {
    console.log(event.value);
  }

  closePopup() {
    this.exclusions.clear();
    this.modalService.dismissAll("close");
    this.addNewExclusion();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getExclusionList();
  }

  //-----form array handling-----------
  get exclusions() {
    return this.addExclusionForm.controls["exclusions"] as FormArray;
  }

  addNewExclusion() {
    const exclusion = this.fb.group({
      name: ["", [Validators.required]],
      status: [false, [Validators.required]],
    });
    this.exclusions.push(exclusion);
  }

  removeExclusion(index: number) {
    this.exclusions.removeAt(index);
  }

  //delete Category of Exclusion popup modal
  deletePopup(deleteModal: any, _id: any) {
    this.exclusionId = _id;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
  }

  //  Edit Category of Exclusion modal
  openVerticallyCenterededitcatexclusion(
    editcatexclusioncontent: any,
    data: any
  ) {
    this.editExclusion.patchValue({
      exclusionId: data._id,
      name: data.name,
      status: data.status,
    });
    this.modalService.open(editcatexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "edit_cat_exclusion",
    });
  }

  //  Add Category of Exclusion modal
  openVerticallyCenteredAddcatexclusioncontent(addcatexclusioncontent: any) {
    this.modalService.open(addcatexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Choose Insurance Company modal
  openVerticallyCenteredchhosecatexcontent(chooseinsurance_catexcontent: any) {
    this.modalService.open(chooseinsurance_catexcontent, {
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
}
