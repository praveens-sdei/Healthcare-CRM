import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InsuranceService } from "./../../../../insurance/insurance.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

// Category Services table data
export interface CatservicePeriodicElement {
  categoryservicename: string;
}
const CATSERVICE_ELEMENT_DATA: CatservicePeriodicElement[] = [
  { categoryservicename: "Paramedical Consultation" },
  { categoryservicename: "Advanced Imaging Test" },
  { categoryservicename: "Paramedical Consultation" },
  { categoryservicename: "Anatomopathologic Paramedical Test" },
];

@Component({
  selector: "app-category-services",
  templateUrl: "./category-services.component.html",
  styleUrls: ["./category-services.component.scss"],
})
export class CategoryServicesComponent implements OnInit {
  // Category Services table data
  catservicedisplayedColumns: string[] = [
    "categoryservicename",
    "status",
    "action",
  ];
  catservicedataSource = CATSERVICE_ELEMENT_DATA;
  editCategoryForm!: FormGroup;
  categoryForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  categoryId: any;
  searchText: any = "";

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private router:Router
  ) {
    this.editCategoryForm = this.fb.group({
      categoryId: [""],
      name: ["", [Validators.required]],
      status: [""],
    });

    this.categoryForm = this.fb.group({
      categories: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
  }

  ngOnInit(): void {
    this.addNewCategory();
    this.getAllCategory();
  }

  getAllCategory() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
    };
    this.service.listCategory(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.totalLength = response.body.totalRecords;
      this.catservicedataSource = response.body.result;
    });
  }

  addCategories() {
    this.isSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    let reqData = {
      categories: this.categoryForm.value.categories,
      userId: this.userId,
    };
    this.service.addCategory(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.toastr.success(response.message);
        this.getAllCategory();
        this.closePopup();
        this._coreService.setCategoryForService(1);


      } else {
        this.toastr.error(response.message);
      }
    });
  }

  updateCategory() {
    this.isSubmitted = true;
    if (this.editCategoryForm.invalid) {
      return;
    }

    this.service
      .updateCategory(this.editCategoryForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status) {
          this.getAllCategory();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  deleteCategory() {
    this.service.deleteCategory(this.categoryId).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.getAllCategory();
        this.toastr.success(response.message);
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handletoggleChange(event: any, data: any) {
    this.editCategoryForm.patchValue({
      categoryId: data?._id,
      name: data?.name,
      status: event.checked,
    });
    this.updateCategory();
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getAllCategory();
  }

  handleSelectInsurance(event: any) {
    console.log(event.value);
  }

  closePopup() {
    this.isSubmitted = false;
    this.categoryForm.reset();
    this.categories.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewCategory();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllCategory();
  }

  //-------Form Array Handling----------------
  newCategoryForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      status: [false],
    });
  }

  get categories(): FormArray {
    return this.categoryForm.get("categories") as FormArray;
  }

  addNewCategory() {
    this.categories.push(this.newCategoryForm());
  }

  removeCategory(i: number) {
    this.categories.removeAt(i);
  }

  //  Add Category service modal
  openVerticallyCenteredAddcatservicecontent(addcatservicecontent: any) {
    this.modalService.open(addcatservicecontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit category service modal
  openVerticallyCenterededitcategoryservice(
    editcatservicecontent: any,
    data: any
  ) {
    this.editCategoryForm.patchValue({
      categoryId: data._id,
      name: data.name,
      status: data.status,
    });
    this.modalService.open(editcatservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_cat_service",
    });
  }

  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, categoryId: any) {
    this.categoryId = categoryId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  //  Choose Insurance Company modal
  openVerticallyCenteredchooseinsurance(chooseinsurancecontent: any) {
    this.modalService.open(chooseinsurancecontent, {
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
