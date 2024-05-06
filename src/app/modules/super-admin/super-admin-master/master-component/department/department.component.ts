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

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
})
export class DepartmentComponent implements OnInit {
  vaccinationdisplayedColumns: string[] = [
    "createdAt",
    "country_name",
    "Region Name",
    "Province Name",
    "Department Name",
    "action",
  ];
  // dataSource: any = [];

  addProvinceDetails!: FormGroup;

  isSubmitted: any = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  VaccinationTestId: any;
  searchKey: any = "";
  selectedFiles: any;
  dataSource: any = [];
  selectedVaccinations: any = [];
  selectedOptions: string;
  countryList: any[] =[];
  contryListEdit : any[] =[]
  regionList: any[] =[];
  provienceList: any[]=[];
  cdRef: any;

  sortColumn: string = 'countryData.name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  DepartmentData : any = {};
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
    this.addProvinceDetails = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
      region_id: ["", [Validators.required]],
      country_id: ["", [Validators.required]],
      province_id: ["", [Validators.required]],
      createdBy:[this.userId]

    });
  }
  get f() {
    return this.addProvinceDetails.controls;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAllDepartmentList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getAllDepartmentList(`${this.sortColumn}:${this.sortOrder}`);
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
  openVerticallyCenteredAddvaccination(addvaccinationcontent: any) {
   this.addProvinceDetails.get("name").patchValue("");
   this.DepartmentData = {}
    this.countryList = []
    this._superAdminService.Country_dropdownLists().subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });
      const countryList = data?.body?.countrylist;
      countryList.map((country)=>{
        this.countryList.push(
          {
            label : country.name,
            value : country._id
          }
        )
      })
    
    });
    this.modalService.open(addvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }
  getRegionList(countryID: any) {
    this.regionList = []
    console.log("------->>>>>>>>>>>>>>>>",countryID);
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        const regionList = result.body?.list;
        regionList.forEach(region => {
          const exists = this.regionList.findIndex(item => item.label === region?.name && item.value === region?._id) !== -1;
          if (!exists) {
            this.regionList.push({
              label: region?.name,
              value: region?._id,
            });
          }
        });
        if(this.DepartmentData)
        {
         this.addProvinceDetails.get("region_id").patchValue(this.DepartmentData?.regionData?._id)
        }
         
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getProvienceList(regionID: any) {
    this.provienceList = []
    console.log("REGION-----------",regionID);
    
    this._superAdminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const provienceList = result.body?.list;
        provienceList.forEach(province => {
          const exists = this.provienceList.findIndex(item => item.label === province?.name && item.value === province?._id) !== -1;
          if (!exists) {
            this.provienceList.push({
              label: province?.name,
              value: province?._id,
            });
          }
        });
       if(this.DepartmentData)
       {
        this.addProvinceDetails.get("province_id").patchValue(this.DepartmentData?.provinceData?._id)
       }
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleSearch(event: any) {
    this.searchKey = event.target.value;
    this.getAllDepartmentList();
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
    this.addProvinceDetails.reset();

  }

  handleaddProvince() {
    this.isSubmitted = true;
    if (this.addProvinceDetails.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    console.log("this.addProvinceDetails.value",this.addProvinceDetails.value);
    
    this.isSubmitted = false;
    this._superAdminService
      .addDepartment(this.addProvinceDetails.value)
      .subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            console.log("resssss",data);
            
            if (data?.status === true) {
              this.loader.stop();
              this.modalService.dismissAll();
              this.closePopup();
              this.getAllDepartmentList();
              this.addProvinceDetails.reset();
              this._coreService.showSuccess(data.message, "");
            }else if(data.status === false){
              this.loader.stop();
              this._coreService.showError(data.message, "");
              this.modalService.dismissAll();
              this.addProvinceDetails.reset();
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
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, VaccinationTestId: any) {
    this.VaccinationTestId = VaccinationTestId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }
  getAllDepartmentList(sort:any='') {
    const params = {
      page: this.page,
      limit: this.pageSize,
      searchKey: this.searchKey,
      sort:sort
    };
    this._superAdminService.DepartmentLists(params).subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });
      this.dataSource = data?.body?.listdata;
      this.totalLength = data?.body?.totalRecords;
    });
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllDepartmentList();
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

    this._superAdminService
      .deleteDepartmentApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status === true) {
          this.loader.stop();
          this.getAllDepartmentList();
          this.toastr.success(response.message);
          this.closePopup();
          this.selectedVaccinations = [];
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  updateCountry() {
    this.isSubmitted = true;
    if (this.addProvinceDetails.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    this._superAdminService
      .updateDepartmentApi(this.addProvinceDetails.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.getAllDepartmentList();
          this.modalService.dismissAll();
          this.toastr.success(response.message);
          this.closePopup();
          this.addProvinceDetails.reset();

          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }
  openVerticallyCenterededitvaccination(
    editvaccinationcontent: any,
    data: any
  ) {
     this.contryListEdit = []
    this._superAdminService.Country_dropdownLists().subscribe(async (res) => {
      let countryData = this._coreService.decryptObjectData({ data: res });
      const countryList = countryData?.body?.countrylist;
      countryList.forEach(country => {
        const exists = this.contryListEdit.findIndex(item => item.label === country?.name && item.value === country?._id) !== -1;
        if (!exists) {
          this.contryListEdit.push({
            label: country?.name,
            value: country?._id,
          });
        }
        
      });
      if(this.DepartmentData)
      {
        console.log(this.DepartmentData?.countryData?._id , "llll" ,data);
        
        this.addProvinceDetails.get("country_id").patchValue(data?.countryData?._id)
  
      }

      await this.getRegionList(data?.regionData?.country_id);

    
      await this.getProvienceList( data?.provinceData?.region_id);
      this.addProvinceDetails.patchValue({
        _id: data?._id,
        name: data?.name,
        // region_id: data?.provinceData?.region_id,
        // country_id: data?.regionData?.country_id,
        // province_id: data?.province_id,
  
      });
      
      this.DepartmentData = data
    });

    // this.addProvinceDetails.patchValue({
    //   _id: data?._id,
    //   name: data?.name,
    //   region_id: data?.provinceData?.region_id,
    //   country_id: data?.regionData?.country_id,
    //   province_id: data?.province_id,

    // });

    this.modalService.open(editvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
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
vaccinationExcleForm: FormGroup = new FormGroup({
  vaccination_csv: new FormControl("", [Validators.required]),
});
  exportVaccination() {
    /* generate worksheet */
    this.loader.start();
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService
      .departmentexcelListforexport(this.page, this.pageSize, this.searchKey)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = ["country_name","region_name","province_name", "name"];
  
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
    this._superAdminService.uploadExcelDepartmentList(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.getAllDepartmentList()
          this.toastr.success(response.message);
          this.closePopup();
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
    link.setAttribute("href", "assets/doc/department.xlsx");
    link.setAttribute("download", `department.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  filterCountries(event:any){
    console.log(event);
    

  }
}
