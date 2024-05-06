import { InsuranceService } from "./../insurance.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { ThisReceiver } from "@angular/compiler";
export interface PeriodicElement {
  name: string;
  status: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [{ name: "abc", status: false }];

@Component({
  selector: "app-insurance-categoryofexclusion",
  templateUrl: "./insurance-categoryofexclusion.component.html",
  styleUrls: ["./insurance-categoryofexclusion.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceCategoryofexclusionComponent implements OnInit {
  displayedColumns: string[] = ["categoryofexclusion", "status", "action"];
  dataSource = ELEMENT_DATA;

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
      status: null,
      searchText: this.searchText,
      
    };

    this.service.listExclusions(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response.body.result)
      this.totalLength = response.body.totalRecords;
      this.dataSource = response.body.result;
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
          this.toastr.success(response.message, "Success");
          this.closePopup();
        } else {
          this.toastr.error(response.message, "Error");
        }
      });
  }

  deleteExclusion() {
    this.service.deleteExclusion(this.exclusionId).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.getExclusionList();
        this.toastr.success(response.message, "Success");
        this.closePopup();
      } else {
        this.toastr.error(response.message, "Error");
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

  //  Add category of exclusion modal
  openVerticallyCenteredaddcatexclusion(addcatexclusioncontent: any) {
    this.modalService.open(addcatexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "add_cat_exclusion",
    });
  }

  //  Edit category of exclusion modal
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

  deletePopup(deleteModal: any, _id: any) {
    this.exclusionId = _id;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
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
