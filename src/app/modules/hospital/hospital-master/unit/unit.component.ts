import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { HospitalService } from "../../hospital.service";
import { log } from "util";
import * as XLSX from "xlsx";
import { NgxUiLoaderService } from "ngx-ui-loader";


// Unit table data
export interface unitPeriodicElement {
  unit: string;
  addedby: string;
}
const UNIT_ELEMENT_DATA: unitPeriodicElement[] = [
  { unit: "Lorem Ipsum", addedby: "Hospital" },
  { unit: "Lorem Ipsum", addedby: "Hospital" },
  { unit: "Lorem Ipsum", addedby: "Hospital" },
  { unit: "Lorem Ipsum", addedby: "Hospital" },
];

@Component({
  selector: "app-unit",
  templateUrl: "./unit.component.html",
  styleUrls: ["./unit.component.scss"],
})
export class UnitComponent implements OnInit {
  // Unit table data
  unitservicedisplayedColumns: string[] = [
    "department",
    "serviceName",
    "unit",
    "addedby",
    "status",
    "action",
  ];
  unitservicedataSource = UNIT_ELEMENT_DATA;
  unitForm!: FormGroup;
  isSubmitted: boolean = false;
  editunitForm!: FormGroup;
  unitId: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  serviceList: any[] = [];
  departmentList: any[] = [];
  hospitalId: any;
  check: any = "true";
  selectedFiles: File;

  sortColumn: string = 'unit';
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
    this.unitForm = this.fb.group({
      unitss: this.fb.array([]),
    });

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.userId = admindata?.in_hospital;

    }else{
      this.userId = loginData?._id;
    }
    this.userPermission = loginData?.permissions;
    
    this.editunitForm = this.fb.group({
      unitId: ["", [Validators.required]],
      for_department: ["", [Validators.required]],
      for_service: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      active_status: ["", [Validators.required]],
    });
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getUnitList(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.hospitalId = loginData?._id;
    this.getUnitList(`${this.sortColumn}:${this.sortOrder}`);
    this.addNewunit();
    this.getServicelist();
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
      //console.log(this.departmentList,"response of data");
    });
  }

  // -----apiCall------//
  getServicelist() {
    let reqData = {
      page: 1,
      limit: 0,
      added_by: this.userId,
      searchText: "",
      for_department: "",
    };

    this.service.getAllServiceApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      const serviceList = response?.body?.data;
      serviceList.map((service)=>{
       this.serviceList.push(
        {
          label : service?.service,
          value : service?._id
        }
       )
      })
    });
  }

  getUnitList(sort:any='') {
    let reqData = {
      limit: this.pageSize,
      page: this.page,
      added_by: this.userId,
      searchText: this.searchText,
      for_service: "",
      sort:sort
    };
    this.service.getAllUnitApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      this.unitservicedataSource = response?.body?.data;
    console.log("working...................", this.unitservicedataSource);

    });
  }

  addUnit() {
    this.isSubmitted = true;
    if (this.unitForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    let reqData = {
      unitArray: this.unitForm.value.unitss,
      added_by: this.userId,
    };
    this.isSubmitted = false;
    this.loader.start();
    console.log(reqData, "reqdata");

    this.service.addUnitApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);

        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updateUnit() {
    this.isSubmitted = true;
    if (this.editunitForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.loader.start();
    let reqData ={
      ...this.editunitForm.value,
      addedby: this.userId
    }
    this.service
      .updateUnitApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getUnitList();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  deleteUnit(action_value: boolean, action_name: any) {
    this.loader.start();
    let reqData = {
      action_name: action_name,
      action_value: action_value,
      unitId: this.unitId,
    };
    this.service.deleteUnitApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getUnitList();
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
    this.unitForm.reset();
    // this.unitss.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.getUnitList();
  }
  handledeleteChange(event: any, unitId: any) {
    (this.unitId = unitId), this.deleteUnit(event.checked, "delete");
  }
  handletoggleChange(event: any, unitId: any) {
    (this.unitId = unitId), this.deleteUnit(event.checked, "active");
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getUnitList();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getUnitList();
  }

  //---------------add-handle form array-------------------
  newUnitForm(): FormGroup {
    return this.fb.group({
      for_service: ["", [Validators.required]],
      for_department: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      active_status: [true],
    });
  }
  get unitss(): FormArray {
    return this.unitForm.get("unitss") as FormArray;
  }

  addNewunit() {
    this.unitss.push(this.newUnitForm());
    this.isSubmitted = false
  }

  removeunit(index: number) {
    this.unitss.removeAt(index);
  }

  handleSelectDepartment(event: any) {
    console.log(event.value, "event is here");

    this.getUnitDepartmentId(event.value, "department");
  }
  getUnitDepartmentId(id: any, type: any) {
    let reqData = {
      inputType: type,
      inputValue: [id],
      added_by: this.hospitalId,
    };
    console.log(reqData, "request data here");

    this.service.getServiceDepartmentUnit(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("SSSSSUUUUUUUUUUUUUUUDDDDDDDDDDDd============>", response);

      if (type === "department") {
        this.serviceList = response.body.serviceDetails;
      }

      // if (type === "service") {
      //   this.basicInfo.patchValue({
      //     departmentt: response?.body?.departmentDetails[0]?._id,
      //   });
      // }
    });
  }
  //  Add units  modal
  openVerticallyCenteredAddunitcontent(addunitcontent: any) {
    this.modalService.open(addunitcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_service",
    });
  }

  //  Edit Services  modal
  openVerticallyCenterededitservice(editunitcontent: any, data: any) {
    console.log(data, "data ise here");

    this.editunitForm.patchValue({
      unitId: data._id,
      unit: data.unit,
      for_department: data.for_service.for_department?._id,
      for_service: data.for_service?._id,
      active_status: data.active_status,
    });

    this.modalService.open(editunitcontent, {
      centered: true,
      size: "md",
      windowClass: "edit_Unit",
    });
  }

  //delete Popup
  deletePoup(deletePoup: any, unitId: any) {
    this.unitId = unitId;
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
    this.service.uploadCSVForUnitHospital(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.getUnitList()
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
    link.setAttribute("href", "assets/doc/unitHospital.xlsx");
    link.setAttribute("download", `unitHospital.xlsx`);
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
    /* generate worksheet */
    this.loader.start();
    var data: any = [];
    this.pageSize = 0;
    this.service
      .unitListforexport(this.page, this.pageSize, this.searchText, this.userId)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });

        if(result.status == true){
          this.loader.stop();
          var array = ["unit_name", "for_department", "for_service", "added_by"];
  
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
