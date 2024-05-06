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
import * as XLSX from "xlsx";
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
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.scss"],
})
export class CountriesComponent implements OnInit {
  vaccinationdisplayedColumns: string[] = [
    "createdAt",
    "Country Name",
    "Country Code",
    "Iso Code",
    "action",
  ];
  // dataSource: any = [];

  addCountryDetails!: FormGroup;

  isSubmitted: any = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  VaccinationTestId: any;
  searchText: any = "";
  selectedFiles: any;
  dataSource: any = [];
  searchKey: any = "";
  selectedVaccinations: any = [];

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
    private loader : NgxUiLoaderService,
    private _superAdminService: SuperAdminService
  ) {

    this.userId = this._coreService.getLocalStorage('loginData')._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.addCountryDetails = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
      country_code: ["", [Validators.required]],
      iso_code: ["", [Validators.required]],
      createdBy:[this.userId]
    });
  }
  get f() {
    return this.addCountryDetails.controls;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllCountryList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getAllCountryList(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("country")) {
          this.innerMenuPremission = checkSubmenu['country'].inner_menu;
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
  
  vaccinationExcleForm: FormGroup = new FormGroup({
    vaccination_csv: new FormControl("", [Validators.required]),
  });

  openVerticallyCenteredAddvaccination(addvaccinationcontent: any) {
    this.modalService.open(addvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
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
  closePopup() {
    this.isSubmitted = false;
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addCountryDetails.reset();
  }
  handleAddcountry() {
    this.isSubmitted = true;
    if (this.addCountryDetails.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")
      return;
    }
    this.loader.start();
    this.isSubmitted = false;

    this._superAdminService.addCountry(this.addCountryDetails.value).subscribe(
      (res) => {
        try {
          let data = this._coreService.decryptObjectData({ data: res });
          if (data.status === true) {
            this.loader.stop();
            this.modalService.dismissAll();
            this.getAllCountryList();
            this.closePopup();
            this.addCountryDetails.reset();
            this._coreService.showSuccess(data.message, "");
          }else if(data.status === false){
            this.loader.stop();
            this._coreService.showError(data.message, "");
            this.modalService.dismissAll();
            this.addCountryDetails.reset();
            this.closePopup();

          }
        } catch (error) {this.loader.stop();}
      },
      (err: Error) => {
        this.loader.stop();
        alert(err.message);
      }
    );
  }

  getAllCountryList(sort:any ='') {
    const params = {
      page: this.page,
      limit: this.pageSize,
      searchKey: this.searchKey,
      sort:sort
    };
    this._superAdminService.CoutryLists(params).subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });

      this.dataSource = data?.body?.listdata;
      this.totalLength = data?.body?.totalRecords;
    });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllCountryList();
  }

  handleSearch(event: any) {
    this.searchKey = event.target.value;
    this.getAllCountryList();
  }
  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }
  excleSubmit() {
    this.isSubmitted = true;
    if (this.vaccinationExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    // formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // uploadExcelMedicine
    this._superAdminService.uploadExcelCountryList(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.toastr.success(response.message);
          
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
          this.closePopup();
        }
      },
      (error: any) => {
        this.loader.stop();
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.toastr.error(response.message);
          this.closePopup();
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
    link.setAttribute("href", "assets/doc/countryList.xlsx");
    link.setAttribute("download", `countryList.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.dataSource?.map((element) => {
        if (!this.selectedVaccinations.includes(element?._id)) {
          this.selectedVaccinations.push(element?._id);
        }
      });
    } else {
      this.selectedVaccinations = [];
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedVaccinations?.length === this.dataSource?.length &&
      this.selectedVaccinations?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }
  openVerticallyCenterededitvaccination(
    editvaccinationcontent: any,
    data: any
  ) {
    console.log("editdetails", data);
    console.log("editvaccinationcontent", editvaccinationcontent);

    this.addCountryDetails.patchValue({
      _id: data?._id,
      name: data?.name,
      country_code: data?.country_code,
      iso_code: data?.iso_code,
    });
    this.modalService.open(editvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }

  updateCountry() {
    this.isSubmitted = true;
    if (this.addCountryDetails.invalid) {
      return;
    }
    this.loader.start();
    this.isSubmitted = false;

    this._superAdminService
      .updateCountryApi(this.addCountryDetails.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.getAllCountryList();
          this.modalService.dismissAll();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
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
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, VaccinationTestId: any) {
    this.VaccinationTestId = VaccinationTestId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  deleteVaccination(
    action_value: boolean,
    action_name: any,
    isDeleteAll: any = ""
  ) {
    this.loader.start();
    let reqData = {
      vaccinationId: this.VaccinationTestId,
      action_name: action_name,
      action_value: action_value,
    };

    if (isDeleteAll === "all") {
      reqData.vaccinationId = "";
    }

    if (isDeleteAll === "selected") {
      reqData.vaccinationId = this.selectedVaccinations;
    }

    this._superAdminService.deleteCountryApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status === true) {
        this.loader.stop();
        this.getAllCountryList();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedVaccinations = [];
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  exportVaccination() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService
      .countryexcelListforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = ["name", "country_code", "iso_code"];
  
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
        }else{
          this.loader.stop();
        }

      });
  }
}
