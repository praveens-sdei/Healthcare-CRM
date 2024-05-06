import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SuperAdminService } from "../../../super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";

// Speciality table data
export interface SpecialityPeriodicElement {
  specialization: string;
  addedby: string;
}
const SPECIALITY_ELEMENT_DATA: SpecialityPeriodicElement[] = [
  { specialization: "Vincent Chase", addedby: "Hospital" },
  { specialization: "Vincent Chase", addedby: "Hospital" },
  { specialization: "Vincent Chase", addedby: "Hospital" },
  { specialization: "Vincent Chase", addedby: "Hospital" },
];


@Component({
  selector: 'app-healthcentre',
  templateUrl: './healthcentre.component.html',
  styleUrls: ['./healthcentre.component.scss']
})
export class HealthcentreComponent implements OnInit {

  specialityservicedisplayedColumns: string[] = [
    "createdAt",
    "healthcentre",
    "addedby",
    "status",
    "action",
  ];
  specialityservicedataSource: any = [];
  healthcentreForm!: FormGroup;
  isSubmitted: boolean = false;
  editHealthcentreForm!: FormGroup;
  healthcentreId: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  selectedFiles: any;

  sortColumn: string = "name";
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService,
    private _superAdminService: SuperAdminService

  ) {
    this.healthcentreForm = this.fb.group({
      healthcentres: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.editHealthcentreForm = this.fb.group({
      healthcentreId: ["", [Validators.required]],
      name: ["", [Validators.required]],
      active_status: ["", [Validators.required]],
    });
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllHealthCentreList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.addnewSpeciality();
    this.getAllHealthCentreList(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("health_centre")) {
          this.innerMenuPremission = checkSubmenu['health_centre'].inner_menu;
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
      }
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  teamExcelForm: FormGroup = new FormGroup({
    specialization_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.teamExcelForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("added_by", this.userId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this._superAdminService.uploadExcelHealthCentreList(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("uploadExcelHealthcareNetwork", response);
        if (response.status) {
          this.loader.stop();
          this.getAllHealthCentreList();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
          this.closePopup();
        }
        this.selectedFiles=null

      },
      (error: any) => {
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.loader.stop();
          this.toastr.error(response.message);
          this.closePopup();
        }
      }
    );
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/HealthCentreList.xlsx");
    link.setAttribute("download", `HealthCentreList.xlsx`);
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
  // exportSpeciality() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-specialty";
  // }



  exportSpeciality() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService.allHealthCentreListforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = [
            "name",
          ];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'HealthCentreList.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }




  getAllHealthCentreList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      sort:sort
    };

    this._superAdminService.HealthCentreLists(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      this.specialityservicedataSource = response?.body?.data;
      
    });
  }
  addHealthCentre() {
    this.isSubmitted = true;
    if (this.healthcentreForm.invalid) {
      this._coreService.showError("", "Please fill all the required fields.");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      healthcentreArray: this.healthcentreForm.value.healthcentres,
      added_by: this.userId,
    };
    this._superAdminService.addHealthCentre(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };

      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllHealthCentreList();
        this.closePopup();
      } else if(response.status === false){
        this.loader.stop();
        this._coreService.showError(response.message, "");
        this.modalService.dismissAll();
        this.closePopup();

      }
    });
  }
  updateHealthCentre() {
    this.isSubmitted = true;
    if (this.editHealthcentreForm.invalid) {
      this._coreService.showError("", "Please fill all the required fields.");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    this._superAdminService
      .updateHealthCentreApi(this.editHealthcentreForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status) {
          this.loader.stop();
          this.getAllHealthCentreList();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }
  selectedSpecialities: any = [];
  deletedHealthCentre(isDeleteAll: any = "") {
    let reqData = {
      healthcentreId: this.healthcentreId,
      action_name: "delete",
      action_value: true,
    };
    this.loader.start();
    if (isDeleteAll === "all") {
      reqData.healthcentreId = "";
    } else {
      reqData.healthcentreId = this.selectedSpecialities;
    }

    console.log("REQ DATA Delete --->", reqData);

    this.service.deleteHealthCentre(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllHealthCentreList();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedSpecialities = [];
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handletoggleChange(event: any, data: any) {
    this.loader.start();
    let reqData = {
      healthcentreId: data?._id,
      action_name: "active",
      action_value: event.checked,
    };

    this.service.deleteHealthCentre(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllHealthCentreList();
        this.toastr.success(response.message);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getAllHealthCentreList();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllHealthCentreList();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.healthcentreForm.reset();
    this.healthcentres.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addnewSpeciality();
  }

  //-------Form Array Handling----------------
  newSpecialityForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      active_status: [true, [Validators.required]],
      delete_status: [false, [Validators.required]],
    });
  }

  get healthcentres(): FormArray {
    return this.healthcentreForm.get("healthcentres") as FormArray;
  }

  addnewSpeciality() {
    this.healthcentres.push(this.newSpecialityForm());
  }

  removeSpeciality(i: number) {
    this.healthcentres.removeAt(i);
  }
  //  Add speciality service modal
  openVerticallyCenteredAddspecialityservicecontent(
    addspecialityservicecontent: any
  ) {
    this.modalService.open(addspecialityservicecontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit speciality service modal
  openVerticallyCenterededitspecialityservice(
    editspecialityservicecontent: any,
    data: any
  ) {
    this.editHealthcentreForm.patchValue({
      healthcentreId: data._id,
      name: data.name,
      active_status: data.active_status,
    });
    this.modalService.open(editspecialityservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_speciality_service",
    });
  }

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, healthcentreId: any) {
    this.healthcentreId = healthcentreId;
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

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.specialityservicedataSource?.map((element) => {
        if (!this.selectedSpecialities.includes(element?._id)) {
          this.selectedSpecialities.push(element?._id);
        }
      });
    } else {
      this.selectedSpecialities = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedSpecialities.push(medicineId);
    } else {
      const index = this.selectedSpecialities.indexOf(medicineId);
      if (index > -1) {
        this.selectedSpecialities.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedSpecialities?.length ===
      this.specialityservicedataSource?.length && this.selectedSpecialities?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }

}
