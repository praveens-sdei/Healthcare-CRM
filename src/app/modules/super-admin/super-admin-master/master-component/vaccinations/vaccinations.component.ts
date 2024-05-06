import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { InsuranceService } from "./../../../../insurance/insurance.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SuperAdminService } from "../../../super-admin.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";
// Vaccination table data
export interface VaccinationPeriodicElement {
  vaccinationname: string;
  addedby: string;
}
const VACCINATION_ELEMENT_DATA: VaccinationPeriodicElement[] = [
  { vaccinationname: "Adenovirus", addedby: "Doctor" },
  { vaccinationname: "Adenovirus", addedby: "Doctor" },
  { vaccinationname: "Adenovirus", addedby: "Doctor" },
  { vaccinationname: "Adenovirus", addedby: "Doctor" },
];

@Component({
  selector: "app-vaccinations",
  templateUrl: "./vaccinations.component.html",
  styleUrls: ["./vaccinations.component.scss"],
})
export class VaccinationsComponent implements OnInit {
  // Vaccination table data
  vaccinationdisplayedColumns: string[] = [
    "createdAt",
    "vaccinationname",
    "addedby",
    "status",
    "action",
  ];
  vaccinationdataSource: any = [];

  editVaccinationForm!: FormGroup;
  vaccinationForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  VaccinationTestId: any;
  searchText: any = "";
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
    private _superAdminService: SuperAdminService,
    private loader : NgxUiLoaderService
  ) {
    this.editVaccinationForm = this.fb.group({
      vaccinationId: [""],
      VaccinationData: this.fb.group({
        name: ["", [Validators.required]],
        active: ["", [Validators.required]],
      }),
    });

    this.vaccinationForm = this.fb.group({
      vaccinationss: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllVaccination(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.addNewVaccination();
    this.getAllVaccination(`${this.sortColumn}:${this.sortOrder}`);

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
        if (checkSubmenu.hasOwnProperty("vaccination")) {
          this.innerMenuPremission = checkSubmenu['vaccination'].inner_menu;
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

  vaccinationExcleForm: FormGroup = new FormGroup({
    vaccination_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.vaccinationExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // uploadExcelMedicine
    this.service.uploadExcelVaccination(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.selectedFiles=null;
          this.getAllVaccination();
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

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/vaccination.xlsx");
    link.setAttribute("download", `vaccination.xlsx`);
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
  // exportVaccination() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-vaccination-test-master";
  // }

  exportVaccination() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService.vaccinationTestMasterListforexport(this.page, this.pageSize, this.searchText)
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
  
          var fileName = 'Vaccinefile.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }


  getAllVaccination(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      sort:sort
    };
    this.service.listVaccinationApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("vaccination====>", response);
      this.totalLength = response?.data?.count;
      this.vaccinationdataSource = response?.data?.result;
    });
  }

  addVaccination() {
    this.isSubmitted = true;
    if (this.vaccinationForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.loader.start();
    let reqData = {
      VaccinationArray: this.vaccinationForm.value.vaccinationss,
      added_by: this.userId,
    };
    this.service.addVaccinationApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllVaccination();
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else if(response.status == false) {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updateVaccination() {
    this.isSubmitted = true;
    if (this.editVaccinationForm.invalid) {
      return;
    }
    this.loader.start();
    console.log("editVaccinationForm====>", this.editVaccinationForm.value);
    this.service
      .updateVaccinationApi(this.editVaccinationForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log("vacc update response=============>", response);
        if (response.status) {
          this.loader.stop();
          this.getAllVaccination();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  selectedVaccinations: any = [];

  deleteVaccination(
    action_value: boolean,
    action_name: any,
    isDeleteAll: any = ""
  ) {
    let reqData = {
      vaccinationId: this.VaccinationTestId,
      action_name: action_name,
      action_value: action_value,
    };
    this.loader.start();
    if (isDeleteAll === "all") {
      reqData.vaccinationId = "";
    }

    if (isDeleteAll === "selected") {
      reqData.vaccinationId = this.selectedVaccinations;
    }

    console.log("REQ DATA Delete --->", reqData);

    this.service.deleteVaccinationApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllVaccination();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedVaccinations = []
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handledeleteChange(event: any, vaccinationId: any) {
    (this.VaccinationTestId = vaccinationId),
      this.deleteVaccination(event.checked, "delete");
  }
  handletoggleChange(event: any, vaccinationId: any) {
    (this.VaccinationTestId = vaccinationId),
      this.deleteVaccination(event.checked, "active");
  }

  handleSearchVaccination(event: any) {
    this.searchText = event.target.value;
    this.getAllVaccination();
  }

  closePopup() {
    this.isSubmitted = false;
    this.vaccinationForm.reset();
    this.vaccinationExcleForm.reset();
    this.vaccinationss.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewVaccination();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllVaccination();
  }

  //-------Form Array Handling----------------
  newVaccinationForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      active: [true],
    });
  }

  get vaccinationss(): FormArray {
    return this.vaccinationForm.get("vaccinationss") as FormArray;
  }

  addNewVaccination() {
    this.vaccinationss.push(this.newVaccinationForm());
  }

  removeVaccination(i: number) {
    this.vaccinationss.removeAt(i);
  }
  //  Add Vaccination modal
  openVerticallyCenteredAddvaccination(addvaccinationcontent: any) {
    this.modalService.open(addvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit Vaccination modal
  openVerticallyCenterededitvaccination(
    editvaccinationcontent: any,
    data: any
  ) {
    this.editVaccinationForm.patchValue({
      vaccinationId: data?._id,
      VaccinationData: {
        name: data?.name,
        active: data.active,
      },
    });
    this.modalService.open(editvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, VaccinationTestId: any) {
    this.VaccinationTestId = VaccinationTestId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }
  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal import",
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

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.vaccinationdataSource?.map((element) => {
        if (!this.selectedVaccinations.includes(element?._id)) {
          this.selectedVaccinations.push(element?._id);
        }
      });
    } else {
      this.selectedVaccinations = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedVaccinations.push(medicineId);
    } else {
      const index = this.selectedVaccinations.indexOf(medicineId);
      if (index > -1) {
        this.selectedVaccinations.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedVaccinations?.length === this.vaccinationdataSource?.length && this.selectedVaccinations?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }
}
