import { ToastrService } from "ngx-toastr";
import { InsuranceService } from "./../insurance.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";

export interface PeriodicElement {
  categoryservicename: string;
}

@Component({
  selector: "app-insurance-categoryservice",
  templateUrl: "./insurance-categoryservice.component.html",
  styleUrls: ["./insurance-categoryservice.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceCategoryserviceComponent implements OnInit {
  displayedColumns: string[] = ["categoryservicename", "status", "action"];
  dataSource: any;
  editCategoryForm!: FormGroup;
  categoryForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any ;
  categoryId: any;
  searchText: any = "";
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService
  ) {
    this.editCategoryForm = this.fb.group({
      categoryId: [""],
      name: ["", [Validators.required]],
      status: [""],
    });

    this.categoryForm = this.fb.group({
      categories: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage('loginData')
    this.userId = userData._id
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
      status: null,
      searchText: this.searchText
      
    };
    this.service.listCategory(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.totalLength = response.body.totalRecords;
      this.dataSource = response.body.result;
    });
  }

  addCategories() {
    this.isSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    this.isSubmitted = false
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
          this.toastr.success(response.message, "success");
          this.closePopup();
        } else {
          this.toastr.error(response.message, "error");
        }
      });
  }

  deleteCategory() {
    this.service.deleteCategory(this.categoryId).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.getAllCategory();
        this.toastr.success(response.message, "success");
        this.closePopup();
      } else {
        this.toastr.error(response.message, "error");
      }
    });
  }

  handletoggleChange(event:any,data:any){
    this.editCategoryForm.patchValue({
      categoryId: data?._id,
      name: data?.name,
      status: event.checked,
    });
    this.updateCategory()
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getAllCategory();
  }

  closePopup() {
    this.categoryForm.reset();
    this.categories.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewCategory()
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


  //  Add category service modal
  openVerticallyCenteredcategoryservice(newhealthplancontent: any) {
    this.modalService.open(newhealthplancontent, {
      centered: true,
      size: "md",
      windowClass: "add_cat_service",
    });
  }

  //  Edit category service modal
  openVerticallyCenterededitcategoryservice(
    editcategoryservicecontent: any,
    data: any
  ) {
    this.editCategoryForm.patchValue({
      categoryId: data._id,
      name: data.name,
      status: data.status,
    });
    this.modalService.open(editcategoryservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_cat_service",
    });
  }

  openVerticallyCenteredsecond(deletePopup: any, categoryId: any) {
    this.categoryId = categoryId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
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
