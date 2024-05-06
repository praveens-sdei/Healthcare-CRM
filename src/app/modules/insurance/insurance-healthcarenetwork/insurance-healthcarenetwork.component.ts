import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SuperAdminService } from "../../super-admin/super-admin.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
interface providertype {
  value: string;
  viewValue: string;
}

export interface PeriodicElement {
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

const ELEMENT_DATA: PeriodicElement[] = [
  {
    providername: "Richards HospitalPharmacy",
    ceoname: "Marvin McKinney",
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
    ceoname: "Marvin McKinney",
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
  selector: "app-insurance-healthcarenetwork",
  templateUrl: "./insurance-healthcarenetwork.component.html",
  styleUrls: ["./insurance-healthcarenetwork.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceHealthcarenetworkComponent implements OnInit {
  displayedColumns: string[] = [
    "dateofcreation",
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
  dataSource = ELEMENT_DATA;
  healthcaredataSource: any[] = [];

  editHealthcareForm!: FormGroup;
  healthcareForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  healthcareId: any;
  searchText: any = "";
  selectedFiles: any;
  insuranceID: any;
  insuranceList: any[] = [];
  insuranceid: any;
  filterByProvider: string = "";

  sortColumn: string = 'provider_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  adminID: any;
  innerMenuPremission:any=[];
  userRole: any;
  autoCompleteHealthCareNetwork: google.maps.places.Autocomplete;
  autoCompleteEditHealthCareNetwork: google.maps.places.Autocomplete;
  loc : any = {};
  index : number;
  selectedFileName: string;


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
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
    });

    let userData = this._coreService.getLocalStorage("loginData");
    const adminData = this._coreService.getLocalStorage("adminData");

    this.userId = userData._id;
    this.userRole = userData.role;

    if(userData.role === "INSURANCE_STAFF"){
      this.adminID = adminData?.for_user;
    }else{
      this.adminID = this.userId;
    }
  }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAllHealthcareNetwork(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
    this.getAllHealthcareNetwork(`${this.sortColumn}:${this.sortOrder}`);
    this.addNewHealthcare();

    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }
  autoAddress() {
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
      console.log(this.healthcareForm);
      
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
     console.log(addressInput);
     
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

  checkInnerPermission(){

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

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

  giveInnerPermission(value){
    if(this.userRole === "INSURANCE_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
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

  onSelectEvent(event: any) {
    this.filterByProvider = event.value
    this.getAllHealthcareNetwork()
  }

  get f() {
    console.log("this.healthcareForm===========>", this.healthcareForm.value);
    return this.healthcareForm.controls;
  }
  healthcareExcleForm: FormGroup = new FormGroup({
    healthcare_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    console.log("excel submit");
    if (this.healthcareExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("user_type", "Insurance");
    formData.append("file", this.selectedFiles);
    formData.append("insuranceID", this.adminID);
    console.log("formdata", formData);
    // uploadExcelMedicine
    this.superAdminService
      .uploadExcelHealthcareNetwork(formData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log("uploadExcelHealthcareNetwork", response);
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
      }, (error: any) => {
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/healthcareNetwork.xlsx");
    link.setAttribute("download", `healthcareNetwork.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
      this.selectedFileName = file.name
      console.log("this.selectedFiles___________",this.selectedFiles);
      
    }
  }
  // exportHealtcareNetwork() {
  //   window.location.href = 'https://mean.stagingsdei.com:451/healthcare-crm-insurance/insurance/export-healthcare-network';
  // }
  exportHealtcareNetwork() {
    this.loader.start();
    let for_portal_user = this.userId
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
  healthCareList: any[] = [];

  getAllHealthcareNetwork(sort: any = '') {
    let reqData = {
      insuranceId: this.userId,
      providerType: this.filterByProvider,
      searchText: this.searchText,
      page: this.page,
      limit: this.pageSize,
      sort: sort
    };
    this.superAdminService
      .listHealthcareNetworkApi(reqData)
      .subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log("response=========>", response);
        this.totalLength = response?.body?.totalResult;
        this.healthCareList = response?.body?.result;
        this.healthcaredataSource = response?.body.result;
      });
  }

  addHealthcareNetwork() {
    this.isSubmitted = true;
    console.log(this.healthcareForm.invalid, 'this.healthcareForm.invalid');

    if (this.healthcareForm.invalid) {
      return;
    }
    this.loader.start();
    let reqData = {
      addedBy: {
        user_id: this.userId,
        user_type: "Insurance",
      },
      insuranceId: this.adminID,
      healthcareNetworkArray: this.healthcareForm.value.healthcare,
    };
    console.log("add=======>", reqData);

    console.log(reqData);
    this.superAdminService
      .addHealthcareNetworkApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log("add=======>", response);
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
      insuranceId: this.adminID,
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
    };
    console.log("editHealthcareForm=======>", reqData);
    this.superAdminService
      .updateHealthcareNetworkApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log("editHealthcareForm=======>", response);

        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getAllHealthcareNetwork();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }
  selectedHealthCare: any = [];
  deleteHealthcareNetwork(action_value: boolean, action_name: any, isDeleteAll: any = "") {
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
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
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
      dateofcreation:[new Date()]

    });
  }

  get healthcare(): FormArray {
    return this.healthcareForm.get("healthcare") as FormArray;
  }

  addNewHealthcare() {
    this.healthcare.push(this.newHealthcareForm());
  }

  removeHealthcare(i: number) {
    this.healthcare.removeAt(i);
  }
  handleSearchHealthcare(event: any) {
    this.searchText = event.target.value;
    this.getAllHealthcareNetwork();
  }

  closePopup() {
    this.isSubmitted = false;
    this.selectedFileName ='';
    this.healthcareForm.reset();
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

  //  Edit Healthcare modal
  openVerticallyCenteredEdithealthcarecontent(
    edithealthcarecontent: any,
    data: any
  ) {
    this.autoAddressEdit()
    console.log("patchvalue", data);
    this.editHealthcareForm.patchValue({
      healthcareNetworkId: data?._id,
      insuranceId: data?.for_portal_user,
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
    this.modalService.open(edithealthcarecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_healthcare",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, healthcareId: any) {
    this.healthcareId = healthcareId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  //  Add healthcare network modal
  openVerticallyCenteredAddhealthnetwork(addhealthcarecontent: any) {
    this.modalService.open(addhealthcarecontent, {
      centered: true,
      size: "lg",
    });
    this.autoAddress()
  }

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "import_subscribes",
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


  updateIndex(i : number) {
    this.index = i
    setTimeout(() => {
      this.autoAddress()
    }, 100);
    console.log(this.index);
    
  }


}
