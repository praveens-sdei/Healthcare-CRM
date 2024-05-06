import { Component, OnInit } from "@angular/core";
import { HospitalService } from "../../hospital.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import * as XLSX from "xlsx";
import { NgxUiLoaderService } from "ngx-ui-loader";


// Services table data
export interface ServicesPeriodicElement {
  services: string;
  addedby: string;
}
const SERVICES_ELEMENT_DATA: ServicesPeriodicElement[] = [
  { services: "Lorem Ipsum", addedby: "Hospital" },
  { services: "Lorem Ipsum", addedby: "Hospital" },
  { services: "Lorem Ipsum", addedby: "Hospital" },
  { services: "Lorem Ipsum", addedby: "Hospital" },
];

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
})
export class ServicesComponent implements OnInit {
  // Services table data
  servicesdisplayedColumns: string[] = [
    "services",
    "departmentName",
    "addedby",
    "status",
    "action",
  ];
  servicesdataSource = SERVICES_ELEMENT_DATA;
  searchText: any = "";
  editServiceForm!: FormGroup;
  serviceForm!: FormGroup;
  departmentList: any[] = [];
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  service_id: any;
  isSubmitted: any = false;
  selectedFiles: File;

  sortColumn: string = 'service';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  userPermission: any;
  innerMenuPremission:any=[];
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: HospitalService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.serviceForm = this.fb.group({
      servicess: this.fb.array([]),
    });

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let admindata = JSON.parse(localStorage.getItem("adminData"));
    this.userRole = loginData?.role;
    this.userPermission = loginData?.permissions;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.userId = admindata?.in_hospital;

    }else{
      this.userId = loginData?._id;
    }

    this.editServiceForm = this.fb.group({
      serviceId: ["", [Validators.required]],
      for_department: ["", [Validators.required]],
      service: ["", [Validators.required]],
      active_status: ["", [Validators.required]],
    });
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getServiceList(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.addNewService();
    this.getServiceList(`${this.sortColumn}:${this.sortOrder}`);
    this.getdepartmentlist();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);  
  }

  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){ 
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("department")) {
          this.innerMenuPremission = checkSubmenu['department'].inner_menu;  
          console.log(`exist in the object.`);
        } else {
          console.log(`does not exist in the object.`);
        }
      }else{
        var checkSubmenu = checkData.submenu;
        let innerMenu = [];
        for (let key in checkSubmenu) {
          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }
        this.innerMenuPremission = innerMenu;
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }


  giveInnerPermission(value){   
    if(this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }

  vaccinationExcleForm: FormGroup = new FormGroup({
    vaccination_csv: new FormControl("", [Validators.required]),
  });
  // ------------api_Call--------------//

  getdepartmentlist() {
    let reqData = {
      page: 1,
      limit: 0,
      added_by: this.userId,
      searchText: "",
    };
    this.service.getAllDepartment(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      this.totalLength = response?.body?.totalCount;
      const departmentList = response?.body?.data;
      departmentList.map((d_list)=>{
      this.departmentList.push(
        {
          label : d_list.department,
          value : d_list._id
        }
      )
      })
    });
  }

  getServiceList(sort:any='') {
    let reqData = {
      limit: 0,
      page: 0,
      added_by: this.userId,
      searchText: this.searchText,
      for_department: "",
      sort:sort
    };
    this.service.getAllServiceApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      this.servicesdataSource = response?.body?.data;
      console.log(" this.servicesdataSource---", this.servicesdataSource);
      
    });
  }
  addService() {
    this.isSubmitted = true;
    if (this.serviceForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    let reqData = {
      serviceArray: this.serviceForm.value.servicess,
      added_by: this.userId,
    };
    this.isSubmitted = false;
    this.loader.start();
    this.service.addServicesApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getServiceList();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  deleteService(action_value: boolean, action_name: any) {
    this.loader.start();
    let reqData = {
      action_name: action_name,
      action_value: action_value,
      serviceId: this.service_id,
    };
    this.service.deleteServiceApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getServiceList();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updateService() {
    this.loader.start();
    this.isSubmitted = true;
    if (this.editServiceForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    let reqData ={
      ...this.editServiceForm.value,
      added_by: this.userId
    }
    this.service
      .updateServiceApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.getServiceList();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  closePopup() {
    // this.modalService.dismissAll("close");
    // this.isSubmitted = false;
    this.serviceForm.reset();
    // this.servicess.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.getServiceList();
  }
  handledeleteChange(event: any, service_id: any) {
    (this.service_id = service_id), this.deleteService(event.checked, "delete");
  }
  handletoggleChange(event: any, service_id: any) {
    (this.service_id = service_id), this.deleteService(event.checked, "active");
  }

  handleSearchCategory(event: any) {
    console.log("----event->", event.target.value);
    this.searchText = event.target.value;
    this.getServiceList();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getServiceList();
  }

  //---------------add-handle form array-------------------
  newSpecialityForm(): FormGroup {
    return this.fb.group({
      for_department: ["", [Validators.required]],
      service: ["", [Validators.required]],
      active_status: [true],
    });
  }
  get servicess(): FormArray {
    return this.serviceForm.get("servicess") as FormArray;
  }

  addNewService() {
    this.servicess.push(this.newSpecialityForm());
  }

  removeService(index: number) {
    this.servicess.removeAt(index);
  }

  //  Add Services  modal
  openVerticallyCenteredAddservicecontent(addservicecontent: any) {
    this.modalService.open(addservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_service",
    });
  }

  //  Edit Services  modal
  openVerticallyCenterededitservice(editservicecontent: any, data: any) {
    this.editServiceForm.patchValue({
      serviceId: data._id,
      service: data.service,
      for_department: data.for_department?._id,
      active_status: data.active_status,
    });

    this.modalService.open(editservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_service",
    });
  }

  //delete Popup
  deletePoup(deletePoup: any, service_id: any) {
    this.service_id = service_id;
    this.modalService.open(deletePoup, { centered: true, size: "sm" });
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


  excleSubmit() {
    this.loader.start();
    this.isSubmitted = true;
    if (this.vaccinationExcleForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // uploadExcelMedicine
    this.service.uploadCSVForService(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.getServiceList()
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      },
      (error: any) => {
        this.loader.stop();
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.toastr.error(response.message);
        }
      }
    );
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
    }
  }
  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/serviceHospital.xlsx");
    link.setAttribute("download", `serviceHospital.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }


  exportVaccination() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this.service
      .serviceListforexport(this.page, this.pageSize, this.searchText, this.userId)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = ["service_name", "for_department", "added_by"];
  
          data = result.data.array;
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = "SheetJS.xlsx";
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });

  }
}
