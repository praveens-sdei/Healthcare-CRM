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
  selector: "app-province",
  templateUrl: "./province.component.html",
  styleUrls: ["./province.component.scss"],
})
export class ProvinceComponent implements OnInit {
  vaccinationdisplayedColumns: string[] = [
    "createdAt",
    "Country Name",
    "Region Name",
    "Province Name",
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
  countryList: any[] = [];
  regionList: any[] = [];

  sortColumn: string = 'countryData.name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  region_id : string = ""
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private _superAdminService: SuperAdminService,
    private loader : NgxUiLoaderService,
  ) {

    this.userId = this._coreService.getLocalStorage('loginData')._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.addProvinceDetails = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
      region_id: ["", [Validators.required]],
      country_id: ["", [Validators.required]],
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
    this.getAllProvinceList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getAllProvinceList(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("province")) {
          this.innerMenuPremission = checkSubmenu['province'].inner_menu;
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
    this.countryList = []
    this.addProvinceDetails.get("name").patchValue("")
    this._superAdminService.Country_dropdownLists().subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });
      const countryList = data?.body?.countrylist;
      countryList.map((country)=>{
        this.countryList.push(
          {
            label :country.name,
            value :country._id
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
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;

    this.pageSize = data.pageSize;

    this.getAllProvinceList();
  }
  handleSearch(event: any) {
    this.searchKey = event.target.value;
    this.getAllProvinceList();
  }
  handleaddProvince() {
    this.isSubmitted = true;
    if (this.addProvinceDetails.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")
      return;
    }
    this.loader.start();
    this.isSubmitted = false;

    this._superAdminService
      .addProvince(this.addProvinceDetails.value)
      .subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            console.log("data-----------------",data);
            
            if (data?.status === true) {
              this.loader.stop();
              this.modalService.dismissAll();
              this.closePopup();
              this.getAllProvinceList();
              this.addProvinceDetails.reset();
              this._coreService.showSuccess(data.message, "");
            }else if(data.status === false){
              this.loader.stop();
              this._coreService.showError(data.message, "");
              this.modalService.dismissAll();
              this.addProvinceDetails.reset();
              this.closePopup();
  
            }
          } catch (error) {
            this.loader.stop();
          }
        },
        (err: Error) => {
          console.log(err);
          this.loader.stop();
          alert(err.message);
        }
      );
  }
  getAllProvinceList(sort:any ='') {
    const params = {
      page: this.page,
      limit: this.pageSize,
      searchKey: this.searchKey,
      sort:sort
    };
    this._superAdminService.ProvinceLists(params).subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });
      this.dataSource = data?.body?.listdata;
      this.totalLength = data?.body?.totalRecords;
    });
  }
  getRegionList(countryID: any) {
    console.log("countryID",countryID);
    this.regionList=[]
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        const regionList = result.body?.list;
        regionList.map((region)=>{
        this.regionList.push(
          {
            label : region.name,
            value : region._id
          }
        )
        })
        if(this.region_id)
        {
          this.addProvinceDetails.get("region_id").patchValue(this.region_id)
        }
        
      },
      error: (err) => {
        console.log(err);
      },
    });
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

    this._superAdminService.deleteProvinceApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status === true) {
        this.loader.stop();
        this.getAllProvinceList();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedVaccinations = [];
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
    this.regionList = []
    this.countryList= []
    console.log("edit--------------------",data);
    this._superAdminService.Country_dropdownLists().subscribe(async(res) => {
      let countryData = this._coreService.decryptObjectData({ data: res });

      
      const countryList = countryData?.body?.countrylist;
      
      countryList.forEach(country => {
        const exists = this.countryList.findIndex(item => item.label === country?.name && item.value === country?._id) !== -1;
        if (!exists) {
          this.countryList.push({
            label: country?.name,
            value: country?._id,
          });
        }
        
      });

      console.log(countryData?._id , "llll");
      
      this._superAdminService.getRegionListByCountryId(countryData?._id).subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          console.log(result);
          const regionList = result.body?.list;
          regionList.map((region)=>{
            this.regionList.push(
              {
                label :region.name,
                value : region._id
              }
            )
          })
        },
        error: (err) => {
          console.log(err);
        },
      });

    await this.getRegionList(data?.regionData?.country_id)
      this.addProvinceDetails.patchValue({
        _id: data?._id,
        name: data?.name,
        country_id: data?.regionData?.country_id,
        region_id: data?.region_id,
      });
      this.region_id = data?.region_id
      console.log(data , "lll");
      
    });

     
    this.modalService.open(editvaccinationcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }

  updateCountry() {
    this.isSubmitted = true;
    if (this.addProvinceDetails.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")
      return;
    }
    this.loader.start();
    this._superAdminService
      .updateProvinceApi(this.addProvinceDetails.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.getAllProvinceList();
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
  exportVaccination() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService
      .provinceexcelListforexport(this.page, this.pageSize, this.searchKey)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = ["country_name", "region_name", "name"];
  
          data = result.data.array;
  
          data.unshift(array);
  
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

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
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
    // formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // uploadExcelMedicine
    this._superAdminService.uploadExcelProvinceList(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status === true) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getAllProvinceList();
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
  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/ProvinceList.xlsx");
    link.setAttribute("download", `ProvinceList.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
