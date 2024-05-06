import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { HospitalService } from "../../hospital.service";
import * as XLSX from "xlsx";
import { NgxUiLoaderService } from "ngx-ui-loader";


// Department table data
export interface DepartmentPeriodicElement {
  department: string;
  addedby: string;
}
const DEPARTMENT_ELEMENT_DATA: DepartmentPeriodicElement[] = [
  { department: "Lorem Ipsum", addedby: "Hospital" },
  { department: "Lorem Ipsum", addedby: "Hospital" },
  { department: "Lorem Ipsum", addedby: "Hospital" },
  { department: "Lorem Ipsum", addedby: "Hospital" },
];

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
})
export class DepartmentComponent implements OnInit {
  // Department table data
  departmentservicedisplayedColumns: string[] = [
    "department",
    "addedby",
    "status",
    "action",
  ];
  departmentservicedataSource = DEPARTMENT_ELEMENT_DATA;
  departmentForm!: FormGroup;
  isSubmitted: boolean = false;
  editDepartmentForm!: FormGroup;
  departmentId: any;
  page: any = 1;
  pageSize: number = 10;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  selectedFiles: File;

  sortColumn: string = 'department';
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
    this.departmentForm = this.fb.group({
      departments: this.fb.array([]),
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

    this.editDepartmentForm = this.fb.group({
      departmentId: ["", [Validators.required]],
      department: ["", [Validators.required]],
      active_status: ["", [Validators.required]],
    });
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAlllist(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.addnewDepartment();
    this.getAlllist(`${this.sortColumn}:${this.sortOrder}`);
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
  getAlllist(sort:any='') {
    let reqData = {
      added_by: this.userId,
      limit: this.pageSize,
      page: this.page,
      searchText: this.searchText,
      sort:sort
    };
    this.service.getAllDepartment(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      this.departmentservicedataSource = response?.body?.data;
    });
  }
  addDepartment() {

    this.isSubmitted = true;
    if (this.departmentForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.isSubmitted = false;
    let reqData = {
      departmentArray: this.departmentForm.value.departments,
      added_by: this.userId,
    };
    this.loader.start();
    this.service.addDepartmentApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAlllist();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  updateDepartment() {
    this.isSubmitted = true;
    if (this.editDepartmentForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.loader.start();
    let reqData = {
      ...this.editDepartmentForm.value,
      addedBy: this.userId
    }

    this.service
      .updateDepartmentApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status) {
          this.loader.stop();
          this.getAlllist();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }
  deleteDepartment() {
    this.loader.start();
    let reqData = {
      departmentId: this.departmentId,
      action_name: "delete",
      action_value: true,
    };
    this.service.deleteDepartmentApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAlllist();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handletoggleChange(event: any, data: any) {
    this.editDepartmentForm.patchValue({
      departmentId: data?._id,
      department: data?.department,
      active_status: event.checked,
    });
    this.updateDepartment();
  }
  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getAlllist();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAlllist();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.departmentForm.reset();
    this.departments.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addnewDepartment();
  }

  //-------Form Array Handling----------------
  newDepartmentForm(): FormGroup {
    return this.fb.group({
      department: ["", [Validators.required]],
      active_status: [true],
      delete_status: [false],
    });
  }

  get departments(): FormArray {
    return this.departmentForm.get("departments") as FormArray;
  }

  addnewDepartment() {
    this.departments.push(this.newDepartmentForm());
  }

  removeDepartment(i: number) {
    this.departments.removeAt(i);
  }
  //  Add Department service modal
  openVerticallyCenteredAddDepartmentservicecontent(
    addDepartmentservicecontent: any
  ) {
    this.modalService.open(addDepartmentservicecontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }
  //  Edit Department service modal
  openVerticallyCenterededitDepartmentservice(
    editDepartmentservicecontent: any,
    data: any
  ) {
    this.editDepartmentForm.patchValue({
      departmentId: data._id,
      department: data.department,
      active_status: data.active_status,
    });
    this.modalService.open(editDepartmentservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_Department_service",
    });
  }

  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, departmentId: any) {
    this.departmentId = departmentId;
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


  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/department_hospital.xlsx");
    link.setAttribute("download", `department_hospital.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
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
    this.service.uploadExcelforDepartment(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getAlllist();
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

  exportVaccination() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;

    this.service
      .departmentListforexport(this.page, this.pageSize, this.searchText, this.userId)
      .subscribe((res) => {

        let result = this._coreService.decryptObjectData({ data: res });

        if(result.status == true){
          this.loader.stop();
          var array = ["department_name", "added_by"];
  
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
