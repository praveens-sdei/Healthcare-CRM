import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  ElementRef,
  ViewChild
} from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SuperAdminService } from "../../../super-admin.service";
import { PatientService } from "../../../../patient/patient.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";


interface providertype {
  value: string;
  viewValue: string;
}
// Healthcare Network table data
export interface HealthcarePeriodicElement {
  providername: string;
  ceoname: string;
  email: string;
  phonenumber: string;
  city: string;
  address: string;
  region: string;
  neighborhood: string;
  providertype: string;
}
const HEALTHCARE_ELEMENT_DATA: HealthcarePeriodicElement[] = [
  {
    providername: "Richards HospitalPharmacy",
    ceoname: "Jerome Bell",
    email: "x@gmail.com",
    phonenumber: "+1 032 4625 123",
    city: "OUAGADOUGOU",
    address: "KOULOUBA",
    region: "West Centre",
    neighborhood: "KOULOUBA",
    providertype: "Hospital",
  },
  {
    providername: "Richards HospitalPharmacy",
    ceoname: "Jerome Bell",
    email: "x@gmail.com",
    phonenumber: "+1 032 4625 123",
    city: "OUAGADOUGOU",
    address: "KOULOUBA",
    region: "West Centre",
    neighborhood: "KOULOUBA",
    providertype: "Hospital",
  },
];

@Component({
  selector: "app-healthcare-network",
  templateUrl: "./healthcare-network.component.html",
  styleUrls: ["./healthcare-network.component.scss"],
})
export class HealthcareNetworkComponent implements OnInit {
  // Healthcare Network table data
  healthcaredisplayedColumns: string[] = [
    "createdAt",
    "insurancename",
    "providername",
    "ceoname",
    "email",
    "phonenumber",
    "city",
    "address",
    "region",
    "neighborhood",
    "providertype",
    "status",
    "action",
  ];
  healthcaredataSource: any = [];
  autoCompleteHealthCareNetwork: google.maps.places.Autocomplete;
  // @ViewChild("address") address!: ElementRef;
  editHealthcareForm!: FormGroup;
  healthcareForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 10;
  totalLength: number = 0;
  userId: any;
  healthcareId: any;
  searchText: any = "";
  selectedFiles: any;
  insuranceID: any = "";
  insuranceList: any[] = [];
  insuranceid: any;
  filterByInsuranceID: string = null;
  filterByProvider: string = "";
  overlay: false;
  insuranceSelectedId: string = "";
  oldInsuracneCompanyId: string = "";
  sortColumn: string = 'for_portal_user.company_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission: any = [];
  loc : any = {};
  index : number;
  loginrole: any;
  autoCompleteEditHealthCareNetwork: google.maps.places.Autocomplete;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private patientService: PatientService,

    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.editHealthcareForm = this.fb.group({
      healthcareNetworkId: [""],
      insuranceId: [""],
      provider_type: ["", [Validators.required]],
      provider_name: ["", [Validators.required]],
      ceo_name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      city: ["", [Validators.required]],
      address: ["", [Validators.required]],
      region: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
    });

    this.healthcareForm = this.fb.group({
      healthcare: this.fb.array([]),
      insuranceId: ["", [Validators.required]],
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }
  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAllHealthcareNetwork(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getInsuranceList();
    this.getAllHealthcareNetwork(`${this.sortColumn}:${this.sortOrder}`);
    this.addNewHealthcare();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }
  aotuAddress() {
   setTimeout(() => {
    const options = {
      fields: [
        "address_components",
        "geometry.location",
        "icon",
        "name",
        "formatted_address",
      ],
      strictBounds: false,
    };

    const addressInput = document.getElementById('address'+this.index) as HTMLInputElement;
    this.autoCompleteHealthCareNetwork = new google.maps.places.Autocomplete(
      addressInput,
      options
    );
    this.autoCompleteHealthCareNetwork.addListener("place_changed", (record) => {
      const place = this.autoCompleteHealthCareNetwork.getPlace(); 
        if(place){
          this.loc.type = "Point";      
          this.loc.coordinates = [
            place?.geometry?.location.lng(),
            place?.geometry?.location.lat(),
          ];
    
          const healthcareControls = this.healthcareForm.get('healthcare') as FormArray;
          if (this.index >= 0 && this.index < healthcareControls.length) {
              const healthcareControl = healthcareControls.controls[this.index];
              healthcareControl.patchValue({
                  address: place.formatted_address,
                  // lng: this.loc?.coordinates[0],
                  // lat: this.loc?.coordinates[1],
              });
          } else {
              console.error('Index out of bounds');
          }
          console.log(" this.healthcareForm", this.healthcareForm.value)
    
        }
    });
   
   }, 100);

  }

  autoAddressEdit() {
    setTimeout(() => {
     const options = {
       fields: [
         "address_components",
         "geometry.location",
         "icon",
         "name",
         "formatted_address",
       ],
       strictBounds: false,
     };
 
     const addressInput = document.getElementById('editAddress') as HTMLInputElement;
     
     this.autoCompleteEditHealthCareNetwork = new google.maps.places.Autocomplete(
       addressInput,
       options
     );
     this.autoCompleteEditHealthCareNetwork.addListener("place_changed", (record) => {
      console.log(this.editHealthcareForm);
      
       const place = this.autoCompleteEditHealthCareNetwork.getPlace(); 
         if(place){
           this.loc.type = "Point";      
           this.loc.coordinates = [
             place?.geometry?.location.lng(),
             place?.geometry?.location.lat(),
           ];
     
           this.editHealthcareForm.patchValue({
            address: place.formatted_address,
          });
         }
     });
    
    }, 100);
 
   }
  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if (checkData) {
      if (checkData.isChildKey == true) {
        var checkSubmenu = checkData.submenu;
        if (checkSubmenu.hasOwnProperty("healthcare_network")) {
          this.innerMenuPremission = checkSubmenu['healthcare_network'].inner_menu;
          console.log(`exist in the object.`);

        } else {
          console.log(`does not exist in the object.`);
        }
      } else {
        var checkSubmenu = checkData.submenu;
        let innerMenu = [];
        for (let key in checkSubmenu) {
          innerMenu.push({ name: checkSubmenu[key].name, slug: key, status: true });
        }
        this.innerMenuPremission = innerMenu;
      }
    }
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    } else {
      return true;
    }
  }

  providerType: providertype[] = [
    { value: "", viewValue: "All Provider" },
    { value: "Hospital", viewValue: "Hospital" },
    { value: "Doctor", viewValue: "Doctor" },
    { value: "Pharmacy", viewValue: "Pharmacy" },
    { value: "Dental", viewValue: "Dental" },
    { value: "Laboratory-Imaging", viewValue: "Laboratory-Imaging" },
    { value: "Optical", viewValue: "Optical" },
    { value: "Paramedical-Professions", viewValue: "Paramedical-Professions" },
  ];

  onSelectEvent(event: any, name: string) {
    let array = [];
    if (name == "insurance") {
      this.filterByInsuranceID = event.value;
    } else if (name == "provider") {
      this.filterByProvider = event.value;
    }
    this.getAllHealthcareNetwork();
  }

  get f() {
    // console.log("this.healthcareForm===========>", this.healthcareForm.value);
    return this.healthcareForm.controls;
  }
  healthcareExcleForm: FormGroup = new FormGroup({
    healthcare_csv: new FormControl("", [Validators.required]),
    insuranceId: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.healthcareExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("user_type", "SuperAdmin");
    formData.append("insuranceID", this.healthcareExcleForm.value.insuranceId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this.superAdminService.uploadExcelHealthcareNetwork(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("uploadExcelHealthcareNetwork", response);
        if (response.status) {
          this.loader.stop();
          this.getAllHealthcareNetwork();
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
    link.setAttribute("href", "assets/doc/healthcareNetwork.xlsx");
    link.setAttribute("download", `healthcareNetworkSampleExcel.xlsx`);
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
  // exportHealtcareNetwork() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-insurance/insurance/export-healthcare-network";
  // }

  exportHealtcareNetwork() {
    this.loader.start();
    let for_portal_user = this.healthcareExcleForm.value.insuranceId
    var data: any = [];
    this.superAdminService.listHealthcareNetworkforexport(for_portal_user)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status == true) {
          this.loader.stop();
          var array = [
            "dateofcreation",
            "providerType",
            "providerName",
            "ceoName",
            "email",
            "mobile",
            "city",
            "address",
            "region",
            "neighborhood"
          ];

          data = result.data.array

          data.unshift(array);
          console.log("data", data);

          var fileName = 'HealthcareNetworkExcel.xlsx';

          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }

  handleInsuranceChange(event: any) {
    this.insuranceID = event.value;
    this.filterByInsuranceID = event.value;
    this.getAllHealthcareNetwork();
  }
  healthCareList: any[] = [];

  getAllHealthcareNetwork(sort: any='') {
    let reqData = {
      insuranceId: this.filterByInsuranceID || null,
      providerType: this.filterByProvider,
      searchText: this.searchText,
      page: this.page,
      limit: this.pageSize,
      sort:sort

    };
    this.superAdminService
      .listHealthcareNetworkApi(reqData)
      .subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        this.totalLength = response?.body?.totalResult;
        this.healthCareList = response?.body?.result;
        this.healthcaredataSource = response?.body.result;
      });
  }

  addHealthcareNetwork() {
    this.isSubmitted = true;
    if (this.healthcareForm.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      addedBy: {
        user_id: this.userId,
        user_type: "Superadmin",
      },
      insuranceId: this.healthcareForm.value.insuranceId,
      healthcareNetworkArray: this.healthcareForm.value.healthcare,
    };
    this.superAdminService
      .addHealthcareNetworkApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log(response , "jjjj");
        
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.getAllHealthcareNetwork();
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  updateHealthcareNetwork() {
    this.isSubmitted = true
    if(this.editHealthcareForm.invalid)
    {
      this._coreService.showError("","Please fill all required field")
      return
    }
    this.isSubmitted = false
    this.loader.start();
    let reqData = {
      healthcareNetworkId: this.editHealthcareForm.value.healthcareNetworkId,
      insuranceId: this.editHealthcareForm.value.insuranceId,
      healthcareNetworkArray: {
        provider_type: this.editHealthcareForm.value.provider_type,
        provider_name: this.editHealthcareForm.value.provider_name,
        ceo_name: this.editHealthcareForm.value.ceo_name,
        email: this.editHealthcareForm.value.email,
        mobile: this.editHealthcareForm.value.mobile,
        city: this.editHealthcareForm.value.city,
        address: this.editHealthcareForm.value.address,
        region: this.editHealthcareForm.value.region,
        neighborhood: this.editHealthcareForm.value.neighborhood,
      },
      oldInsuracneCompanyId: this.editHealthcareForm.value.insuranceId != this.insuranceSelectedId ? this.insuranceSelectedId : ''
    };
    this.superAdminService
      .updateHealthcareNetworkApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status) {
          this.loader.stop();
          this.getAllHealthcareNetwork();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  selectedHealthCare: any = [];
  deleteHealthcareNetwork(
    action_value: boolean,
    action_name: any,
    isDeleteAll: any = ""
  ) {
    this.loader.start();
    let reqData = {
      healthcareNetworkId: this.healthcareId,
      action_name: action_name,
      action_value: action_value,
    };

    if (isDeleteAll === "all") {
      reqData.healthcareNetworkId = "";
    }

    if (isDeleteAll === "selected") {
      reqData.healthcareNetworkId = this.selectedHealthCare;
    }

    console.log("REQ DATA Delete --->", reqData);

    // return;

    this.superAdminService
      .deleteHealthcareNetworkApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.getAllHealthcareNetwork();
          this.toastr.success(response.message);
          this.closePopup();
          this.selectedHealthCare = []
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  getInsuranceList() {
    this.patientService.getInsuanceList().subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      const arr = response?.body?.result;
      arr.unshift({
        for_portal_user: { _id: "" },
        company_name: "Select Insurance Company",
      });
      arr.map((curentval: any) => {
        this.insuranceList.push({
          label: curentval?.company_name,
          value: curentval?.for_portal_user?._id,
        });
      });
      console.log(this.insuranceList, "insuranceList");
    });
  }
  //-------Form Array Handling----------------
  newHealthcareForm(): FormGroup {
    return this.fb.group({
      providerType: ["", [Validators.required]],
      providerName: ["", [Validators.required]],
      ceoName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      city: ["", [Validators.required]],
      address: ["", [Validators.required]],
      region: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      dateofcreation: [new Date(), [Validators.required]]
    });
  }

  get healthcare(): FormArray {
    return this.healthcareForm.get("healthcare") as FormArray;
  }

  addNewHealthcare(i? : number) {
    if(!i)
    {
      this.index = 0
    }
    this.healthcare.push(this.newHealthcareForm());
    console.log(this.index , "add");
  }

  removeHealthcare(i: number) {
    this.healthcare.removeAt(i);
    console.log(this.index , "rem");
    
  }
  handleSearchHealthcare(event: any) {
    this.searchText = event.target.value;
    this.page = 1;
    this.getAllHealthcareNetwork();
  }

  closePopup() {
    this.isSubmitted = false;
    this.healthcareForm.reset();
    this.healthcareExcleForm.reset();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllHealthcareNetwork();
  }

  get healthcaress(): FormArray {
    return this.healthcareForm.get("healthcaress") as FormArray;
  }

  //  Add Healthcare modal
  openVerticallyCenteredAddhealthcarecontent(addhealthcarecontent: any) {
    this.modalService.open(addhealthcarecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_healthcare",
    });
    this.aotuAddress()
  }

  //  Edit Healthcare modal
  openVerticallyCenteredEdithealthcarecontent(
    edithealthcarecontent: any,
    data: any
  ) {
    this.autoAddressEdit()
    console.log(data, "data");

    this.insuranceSelectedId = data?.for_portal_user?.for_portal_user;

    this.editHealthcareForm.patchValue({
      healthcareNetworkId: data?._id,
      insuranceId: data?.for_portal_user?.for_portal_user,
      provider_type: data?.provider_type,
      provider_name: data?.provider_name,
      ceo_name: data?.ceo_name,
      email: data?.email,
      mobile: data?.mobile,
      city: data?.city,
      address: data?.address,
      region: data?.region,
      neighborhood: data?.neighborhood,
    });
    console.log("editform", this.editHealthcareForm.value);
    this.modalService.open(edithealthcarecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_healthcare",
    });
    //this.getAllHealthcareNetwork();
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, healthcareId: any) {
    this.healthcareId = healthcareId;
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


  //add import modal
  openVerticallyCenteredimportExport(ExportMedicine: any) {
    this.modalService.open(ExportMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
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
      this.healthcaredataSource?.map((element) => {
        if (!this.selectedHealthCare.includes(element?._id)) {
          this.selectedHealthCare.push(element?._id);
        }
      });
    } else {
      this.selectedHealthCare = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedHealthCare.push(medicineId);
    } else {
      const index = this.selectedHealthCare.indexOf(medicineId);
      if (index > -1) {
        this.selectedHealthCare.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedHealthCare?.length === this.healthcaredataSource?.length &&
      this.selectedHealthCare?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }

  handletoggleChange(event: any, data: any) {
    console.log(event, "log check statu", data);
    this.loader.start();
    let reqData = {
      healthcareNetworkId: data._id,
      action_name: "active",
      action_value: event.checked,
    };
    console.log(reqData, "reqData1234");


    this.superAdminService.deleteHealthcareNetworkApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        // this.getlabList();
        // this.handleClose();
        this._coreService.showSuccess(response.message, "");
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleDOCChange(type: string) {
    if (type === "dateofcreation") {
      new Date(this.healthcareForm.controls["dateofcreation"].value);
    } else {
      new Date(this.healthcareForm.controls["dateofjoining"].value);
    }
  }

  updateIndex(i : number) {
    this.index = i
    setTimeout(() => {
      this.aotuAddress()
    }, 100);
    console.log(this.index);
    
  }
}
