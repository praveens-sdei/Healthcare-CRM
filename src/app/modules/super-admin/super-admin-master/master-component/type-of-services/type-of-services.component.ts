import { InsuranceService } from "./../../../../insurance/insurance.service";
import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

// Type of Services table data
export interface TypeofservicePeriodicElement {
  typeofservicename: string;
  categoryservicename: string;
}
const TYPEOFSERVICE_ELEMENT_DATA: TypeofservicePeriodicElement[] = [
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
  selector: "app-type-of-services",
  templateUrl: "./type-of-services.component.html",
  styleUrls: ["./type-of-services.component.scss"],
})
export class TypeOfServicesComponent implements OnInit {
  // Type of Services table data
  typeofservicedisplayedColumns: string[] = [
    "typeofservicename",
    "categoryservicename",
    "status",
    "action",
  ];
  typeofservicedataSource = TYPEOFSERVICE_ELEMENT_DATA;
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
  catSubscription: Subscription;

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
    this.catSubscription = this._coreService.SharingCategory.subscribe((res)=>{
      if (res != 'default') {
        this.getAllCategory();
      } 
    })
    this.addNewService();
    this.getAllCategory();
    this.listAllServices();
  }



  getAllCategory() {
    let reqData = {
      page: 1,
      limit: 10000,
      userId: this.userId,
      searchText: "",
      status: true,
    };
    this.service.listCategory(reqData).subscribe({
      next:async (res) => {
        let encryptedData = { data: await res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log(response);
        this.categoryList = response.body.result;
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
        
      }
    });
  }

  listAllServices() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      in_category: "",
      searchText: this.searchText,
      status: null,
    };
    this.service.listCategoryServices(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.typeofservicedataSource = response.body.result;
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
    this.service.addCategoryServices(reqData).subscribe((res: any) => {
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
      });
  }

  updateService() {
    this.service
      .updateCatgeoryService(this.editService.value)
      .subscribe((res) => {
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
        });
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

  handleSelectInsurance(event: any) {
    console.log(event.value);
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

  //  Add Type of Services  modal
  openVerticallyCenteredAddtypeofservicecontent(addtypeofservicecontent: any) {
    this.modalService.open(addtypeofservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_typeofservice",
    });
  }

  //  Edit Type of Services  modal
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

  //delete Popup
  deletePoup(deletePoup: any, service_id: any) {
    this.service_id = service_id;
    this.modalService.open(deletePoup, { centered: true, size: "sm" });
  }

  //  Choose Insurance Company modal
  openVerticallyCenteredchooseinsurancetoscontent(
    chooseinsurance_toscontent: any
  ) {
    this.modalService.open(chooseinsurance_toscontent, {
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
    if (this.catSubscription) {
      this.catSubscription.unsubscribe();
    }
  }
}
