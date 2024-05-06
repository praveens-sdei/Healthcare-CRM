import { ToastrService } from "ngx-toastr";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { InsuranceService } from "../insurance.service";
import { CoreService } from "src/app/shared/core.service";
import { I } from "@angular/cdk/keycodes";

export interface PeriodicElement {
  typeofservicename: string;
  categoryservicename: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    typeofservicename: "Specialist",
    categoryservicename: "Medical Consultation",
  },
  {
    typeofservicename: "Specialist",
    categoryservicename: "Medical Consultation",
  },
  {
    typeofservicename: "Specialist",
    categoryservicename: "Medical Consultation",
  },
  {
    typeofservicename: "Specialist",
    categoryservicename: "Medical Consultation",
  },
  {
    typeofservicename: "Specialist",
    categoryservicename: "Medical Consultation",
  },
  {
    typeofservicename: "Specialist",
    categoryservicename: "Medical Consultation",
  },
];

@Component({
  selector: "app-insurance-typeofservice",
  templateUrl: "./insurance-typeofservice.component.html",
  styleUrls: ["./insurance-typeofservice.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceTypeofserviceComponent implements OnInit {
  displayedColumns: string[] = [
    "typeofservicename",
    "categoryservicename",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchText: any = "";
  editService!: FormGroup;
  addService!: FormGroup;
  serviceForm!: FormGroup;
  categoryList: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  service_id: any;
  isSubmitted: any = false;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService
  ) {
    this.editService = this.fb.group({
      categoryServiceId: ["", [Validators.required]],
      categoryId: ["", [Validators.required]],
      name: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });

    this.addService = this.fb.group({
      services: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
  }

  ngOnInit(): void {
    this.addNewService();
    this.getAllCategory();
    this.listAllServices();
  }

  getAllCategory() {
    let reqData = {
      page: 1,
      limit: 100,
      userId: this.userId,
      searchText: "",
      status: true,
    };
    this.service.listCategory(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.categoryList = response.body.result;
    });
  }

  listAllServices() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      in_category: "",
      status: null,
      searchText: this.searchText,
    };
    this.service.listCategoryServices(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.dataSource = response.body.result;
      this.totalLength = response.body.totalRecords;
    });
  }

  addCategoryService() {
    // this.isSubmitted=true
    // if(this.serviceForm.invalid){
    //   return
    // }
    let reqData = {
      services: this.addService.value.services,
      userId: this.userId,
    };
    this.service.addCategoryServices(reqData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.toastr.success(response.message);
          this.listAllServices();
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      },
      (err) => {
        let errorResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errorResponse.message);
      }
    );
  }

  updateService() {
    this.service.updateCatgeoryService(this.editService.value).subscribe(
      (res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.toastr.success(response.message);
          this.listAllServices();
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      },
      (err) => {
        let errorResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errorResponse.message);
      }
    );
  }

  deleteService() {
    this.service.deleteCategoryService(this.service_id).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.toastr.success(response.message);
        this.listAllServices();
        this.closePopup();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handleToggleChange(event: any, data: any) {
    this.editService.patchValue({
      categoryServiceId: data?._id,
      categoryId: data.in_category?._id,
      name: data?.name,
      status: event.checked,
    });
    this.updateService();
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.listAllServices();
  }

  closePopup() {
    this.services.clear();
    this.serviceForm.reset();
    this.modalService.dismissAll("close popup");
    this.addNewService();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.listAllServices();
  }

  //----------------handle form array-------------------
  get services() {
    return this.addService.controls["services"] as FormArray;
  }

  // f(index) {
  //   let serviceList = this.addService.get('services') as FormArray;
  //   const formGroup = serviceList.controls[index] as FormGroup;
  //   return formGroup;
  // }

  addNewService() {
    this.serviceForm = this.fb.group({
      in_category: ["", [Validators.required]],
      name: ["", [Validators.required]],
      status: [false, [Validators.required]],
    });
    this.services.push(this.serviceForm);
  }

  removeService(index: number) {
    this.services.removeAt(index);
  }

  //  Add type of service modal
  openVerticallyCenteredtypeofservice(addtypeofservicecontent: any) {
    this.modalService.open(addtypeofservicecontent, {
      centered: true,
      size: "md",
      windowClass: "add_typeof_service",
    });
  }

  //  Edit type of service modal
  openVerticallyCenterededittypeofservice(
    edittypeofservicecontent: any,
    data: any
  ) {
    this.editService.patchValue({
      categoryServiceId: data._id,
      categoryId: data.in_category._id,
      name: data.name,
      status: data.status,
    });

    this.modalService.open(edittypeofservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_typeof_service",
    });
  }

  openVerticallyCenteredsecond(insurancepopup: any, service_id: any) {
    this.service_id = service_id;
    this.modalService.open(insurancepopup, { centered: true, size: "sm" });
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
