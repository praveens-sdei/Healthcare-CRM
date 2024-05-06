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
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.scss']
})
export class ImmunizationComponent implements OnInit {
  specialityservicedisplayedColumns: string[] = [
    "createdAt",
    "name",
    "addedby",
    "status",
    "action",
  ];
  immunizationdataSource: any = [];
  immunizationForm!: FormGroup;
  isSubmitted: boolean = false;
  editImmunizationForm!: FormGroup;
  immunizationId: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  selectedFiles: any;

  sortColumn: string = 'name';
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
    private router: Router,
    private _superAdminService: SuperAdminService

  ) {
    this.immunizationForm = this.fb.group({
      immunizations: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.editImmunizationForm = this.fb.group({
      immunizationId: ["", [Validators.required]],
      name: ["", [Validators.required]],
      active_status: ["", [Validators.required]],
    });
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllImmunization(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.addnewSpeciality();
    this.getAllImmunization(`${this.sortColumn}:${this.sortOrder}` );
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
        if (checkSubmenu.hasOwnProperty("immunization")) {
          this.innerMenuPremission = checkSubmenu['immunization'].inner_menu;
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
    const formData = new FormData();
    formData.append("added_by", this.userId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this._superAdminService.uploadExcelImmunizationList(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("uploadExcelHealthcareNetwork", response);
        if (response.status) {
          this.getAllImmunization();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.toastr.error(response.message);
          this.closePopup();
        }
        this.selectedFiles=null

      },
      (error: any) => {
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.toastr.error(response.message);
          this.closePopup();
        }
      }
    );
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/ImmunizationFile.xlsx");
    link.setAttribute("download", `ImmunizationFile.xlsx`);
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
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService.allImmunizationListforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        var array = [
          "name",
        ];

        data = result.data.array

        data.unshift(array);
        console.log("data", data);

        var fileName = 'ImmunizationFile.xlsx';

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, fileName);
      });
  }




  getAllImmunization(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      sort:sort
    };

    this._superAdminService.ImmunizationLists(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      this.immunizationdataSource = response?.body?.data;
    });
  }
  addImmunization() {
    this.isSubmitted = true;
    if (this.immunizationForm.invalid) {
      return;
    }
    let reqData = {
      immunizationArray: this.immunizationForm.value.immunizations,
      added_by: this.userId,
    };
    this._superAdminService.addImmunization(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };

      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.toastr.success(response.message);
        this.getAllImmunization();
        this.closePopup();
      } else if(response.status === false){
        this._coreService.showError(response.message, "");
        this.modalService.dismissAll();
        this.closePopup();

      }
    });
  }
  updateImmunization() {
    this.isSubmitted = true;
    if (this.editImmunizationForm.invalid) {
      return;
    }
    this._superAdminService
      .updateImmunizationApi(this.editImmunizationForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status) {
          this.getAllImmunization();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
  }
  selectedSpecialities: any = [];
  deletedImmunzations(isDeleteAll: any = "") {
    let reqData = {
      immunizationId: this.immunizationId,
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.immunizationId = "";
    } else {
      reqData.immunizationId = this.selectedSpecialities;
    }

    console.log("REQ DATA Delete --->", reqData);

    this._superAdminService.deleteImmunization(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.getAllImmunization();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedSpecialities = [];
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handletoggleChange(event: any, data: any) {
    let reqData = {
      immunizationId: data?._id,
      action_name: "active",
      action_value: event.checked,
    };

    this._superAdminService.deleteImmunization(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        
        this.getAllImmunization();
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getAllImmunization();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllImmunization();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.immunizationForm.reset();
    this.immunizations.clear();
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

  get immunizations(): FormArray {
    return this.immunizationForm.get("immunizations") as FormArray;
  }

  addnewSpeciality() {
    this.immunizations.push(this.newSpecialityForm());
  }

  removeSpeciality(i: number) {
    this.immunizations.removeAt(i);
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
    this.editImmunizationForm.patchValue({
      immunizationId: data._id,
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
  openVerticallyCenteredsecond(deletePopup: any, immunizationId: any) {
    this.immunizationId = immunizationId;
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
      this.immunizationdataSource?.map((element) => {
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
      this.immunizationdataSource?.length && this.selectedSpecialities?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }
}
