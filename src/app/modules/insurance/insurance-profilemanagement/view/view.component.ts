import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InsuranceService } from "../../insurance.service";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { IInsuranceStaffResponse } from "../../insurance-staffmanagement/addstaff/insurance-add-staff.type";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import Validation from "src/app/utility/validation";
import intlTelInput from 'intl-tel-input';
import { NgbModal,ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent implements OnInit {
  @ViewChild("activateDeactivate") activateDeactivate: TemplateRef<any>;
  userId: any = "";
  profileDetails: any;
  editStaff: FormGroup;
  groupIcon: any = "";
  logoIcon: any = "";
  userRole: any;
  selectedCountryCode: any;
  iti: any;
  countrycodedb: any;
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  locationData: any;
  spokenLanguages: any[] = [];
  country: any = "";
  region: any = "";
  province: any = "";
  department: any = "";
  city: any = "";
  village: any = "";
  isSubmitted: boolean = false;
  staffRole:any =[];
  selectedFiles: any = '';
  overlay:false;
  selectedLanguages:any = [];
  staffData: any;
  staff_profilePic: any;
  staff_ID: any;
  @ViewChild('editstaffcontent') editstaffcontent: TemplateRef<any>;
  loc: any={};
  profile_pic: any;
  notificationData: any;
  notificationStatus: any = "want";
  toastr: any;
  constructor(
    private fb: FormBuilder,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private route: Router,
    private _superAdminService: SuperAdminService,
    private auth: AuthService,
    private modalService: NgbModal,
  ) {

    this.editStaff = this.fb.group(
      {
        staff_profile: [""],
        staff_name: [""],
        first_name: ["", [Validators.required]],
        middle_name: [""],
        last_name: ["", [Validators.required]],
        dob: ["", [Validators.required]],
        // language: [""],
        address: ["", [Validators.required]],
        neighbourhood: [""],
        country: ["", [Validators.required]],
        region: [""],
        province: [""],
        department: [""],
        city: [""],
        village: [""],
        pincode: [""],
        degree: [""],
        mobile: ["", [Validators.required]],
        email: ["", [Validators.required]],
        userName: [""],
        role:[""],
        aboutStaff: [""],
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userId = loginData?._id;
    this.userRole = loginData?.role;
    
    if (this.userRole ==="INSURANCE_ADMIN") {
      console.log("this.userId", this.userRole);
      this.getInsuranceDetails();
    }
    else {
      this.getSpecifiStaffDetails(this.userId);

    }

  
  }


  handleEditProfile() {
    if (this.userRole == "INSURANCE_ADMIN") {    
      this.route.navigate(['/insurance/profile/edit'])      
    } else if (this.userRole == "INSURANCE_STAFF") {      
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      this.staff_ID = loginData?._id
      this.openVerticallyCenterededitstaff(this.editstaffcontent, this.staff_ID);
    }
  }
  openVerticallyCenterededitstaff(editstaffcontent: any, id: any) {
    console.log(id, "---->");

    this.getSpecifiStaffDetails(id);
    this.modalService.open(editstaffcontent, {
      centered: true,
      size: "xl",
      windowClass: "edit_staffnew",
    });
  }

  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }

  staffIcon: any = null
  selectFile(event: any) {
    let file = event.target.files[0];
    console.log("file", file);

    const formData: FormData = new FormData();

    formData.append(
      "userId", this.staff_ID

    );
    formData.append("docType", 'staff_profile');
    formData.append("multiple", "false");
    formData.append("docName", file);
    this.selectedFiles = formData;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profile_pic = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
    this.uploadDocuments(this.selectedFiles);
  }
  keyURL: any = "";
  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._insuranceService.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData({ data: res });
          resolve(response);
          console.log("response",response);
          
          this.keyURL = response.data[0].key;
          console.log("this.keyURL",this.keyURL);
          
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this._coreService.showError(errResponse.messgae, "");
        }
      );
    });
  }

  public onSubmit() {
    this.isSubmitted = true;
    console.log(this.editStaff.invalid, 'this.editStaff.invalid');

    if (this.editStaff.invalid) {
      return;
    }
    const values = this.editStaff.value
    console.log("values--->",values);
    // return
    const formaData = new FormData();
    formaData.append("staff_profile",this.keyURL )
    formaData.append("staff_name", values.first_name + " " + values.middle_name + " " + values.last_name)
    formaData.append("first_name", values.first_name)
    formaData.append("middle_name", values.middle_name)
    formaData.append("last_name", values.last_name)
    formaData.append("dob", values.dob)
    // formaData.append("language", JSON.stringify(this.selectedLanguages))
    formaData.append("address", values.address)
    formaData.append("neighbourhood", values.neighbourhood)
    formaData.append("country", values.country ? values.country : "")
    formaData.append("region", values.region ? values.region : "")
    formaData.append("province", values.province ? values.province : "")
    formaData.append("department", values.department ? values.department : "")
    formaData.append("city", values.city ? values.city : "")
    formaData.append("village", values.village ? values.village : "")
    formaData.append("pincode", values.pincode)
    formaData.append("degree", values.degree)
    formaData.append("phone", values.mobile)
    formaData.append("email", values.email)
    formaData.append("role", JSON.stringify(this.staffRole))
    formaData.append("userName", values.userName)
    formaData.append("aboutStaff", values.aboutStaff)
    formaData.append("id", this.staff_ID)
    formaData.append("country_code", this.selectedCountryCode)  
    
    this._insuranceService.editStaff(formaData).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
        console.log("result",result);
        
        const decryptedResult = this._coreService.decryptObjectData(result)

        console.log(decryptedResult, 'decryptedResult');
        if(decryptedResult.status == true){

          this._coreService.showSuccess("", "Staff updated successfully");
          this.getSpecifiStaffDetails(this.staff_ID)
          this.handleClose()
        }else{
          this._coreService.showError("", decryptedResult.message);

        }
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');

        this._coreService.showError("", err.message);
        if (err.message === "INTERNAL_SERVER_ERROR") {
          this._coreService.showError("", err.message);
        }
      },
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.editStaff.reset()
    this.staff_ID = '';
  }



 
 onFocus = () => {
  var getCode = this.iti.getSelectedCountryData().dialCode;
  this.selectedCountryCode = "+" + getCode;
}
autoComplete: google.maps.places.Autocomplete;
getCountrycodeintlTelInput() {
  var country_code = '';
  const countryData = (window as any).intlTelInputGlobals.getCountryData();
  for (let i = 0; i < countryData.length; i++) {
    if (countryData[i].dialCode === this.countrycodedb.split("+")[1]) {
      country_code = countryData[i].iso2;
      break; // Break the loop when the country code is found
    }
  }
  const input = document.getElementById('mobile') as HTMLInputElement;
  const adressinput = document.getElementById('address') as HTMLInputElement;
  if(input){
    this.iti = intlTelInput(input, {
      initialCountry: country_code,
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
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
    this.autoComplete = new google.maps.places.Autocomplete(
      adressinput,
      options
    );
    this.autoComplete.addListener("place_changed", (record) => {
      const place = this.autoComplete.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];
      this.editStaff.patchValue({
        address: place.formatted_address,
        loc: this.loc,
      });
    })
  }


}
ngAfterViewInit() {
  // const input = this.countryPhone?.nativeElement;
  // console.log(input);

  // // const input = document.querySelector("#phone");
  // this.iti = intlTelInput(input, {
  //   initialCountry: "fr",
  //   separateDialCode: true
  // });
  // this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
}

  getInsuranceDetails() {
    let reqData = {
      id: this.userId,
    };

    this._insuranceService.getProfileDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("PROFILE DETAILS===>", response);
      if (response.status) {
        this.profileDetails = response?.body;
      }

      this.groupIcon = response?.body?.profile_pic_signed_url
      console.log("PROFILE DETAILS===>", this.groupIcon);

      this.logoIcon = response?.body?.company_logo_signed_url
    });
  }
  handleRemoveLogo() {
    this.profile_pic = ""
  }
  getSpecifiStaffDetails(id) {
    this._insuranceService.getStaffDetails(id).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
        const staffDetailsResult = this._coreService.decryptObjectData(result)
        
        const staffDetails =staffDetailsResult?.body?.staffData
         this.selectedLanguages = staffDetails.language;

        this.staffRole = staffDetails?.role.map((ele)=>{
          return ele._id
        })
        console.log(staffDetails, 'decryptedData',this.staffRole);

        this.staffData = staffDetails
        this.locationData = staffDetails?.in_location;
        console.log(this.staffData , "pppppppppppp");
        let dateString = this.convertDate(staffDetails?.dob)
        this.profile_pic = staffDetailsResult?.body?.documentURL
        console.log(this.profile_pic, 'decryptedData2');

        this.getCountryList(staffDetails?.in_location?.country);
        this.getRegionList(staffDetails?.in_location?.country,staffDetails?.in_location?.region);
        this.getProvienceList(staffDetails?.in_location?.region,staffDetails?.in_location?.province);
        this.getDepartmentList(staffDetails?.in_location?.province,staffDetails?.in_location?.department);
        this.getCityList(staffDetails?.in_location?.department,staffDetails?.in_location?.city,staffDetails?.in_location?.village);
        this.getSpokenLanguage();
        this.editStaff.controls['first_name'].setValue(staffDetails?.first_name)
        this.editStaff.controls['middle_name'].setValue(staffDetails?.middle_name)
        this.editStaff.controls['last_name'].setValue(staffDetails?.last_name)
        this.editStaff.controls['dob'].setValue(dateString)
        // this.editStaff.controls['language'].setValue(staffDetails?.language)
        this.editStaff.controls['address'].setValue(staffDetails?.in_location?.address)
        this.editStaff.controls['neighbourhood'].setValue(staffDetails?.in_location?.neighborhood)
        this.editStaff.controls['country'].setValue(staffDetails?.in_location?.country)
        this.editStaff.controls['region'].setValue(staffDetails?.in_location?.region)
        this.editStaff.controls['province'].setValue(staffDetails?.in_location?.province)
        this.editStaff.controls['department'].setValue(staffDetails?.in_location?.department)
        this.editStaff.controls['city'].setValue(staffDetails?.in_location?.city)
        this.editStaff.controls['village'].setValue(staffDetails?.in_location?.village)
        this.editStaff.controls['pincode'].setValue(staffDetails?.in_location?.pincode)
        this.editStaff.controls['degree'].setValue(staffDetails?.degree)
        this.editStaff.controls['mobile'].setValue(staffDetails?.for_portal_user?.mobile)
        this.editStaff.controls['email'].setValue(staffDetails?.for_portal_user?.email)
        this.editStaff.controls['userName'].setValue(staffDetails?.for_portal_user?.user_name)
        this.editStaff.controls['role'].setValue(staffDetails?.role?._id)

        this.editStaff.controls['aboutStaff'].setValue(staffDetails?.about)
        this.countrycodedb = staffDetails?.for_portal_user?.country_code

        this.getCountrycodeintlTelInput();
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');
      },
    });
  }

  convertDate(date){
    let dateString: any = new Date(date);
        let dd = String(dateString.getDate()).padStart(2, "0");
        let mm = String(dateString.getMonth() + 1).padStart(2, "0");
        let yyyy = dateString.getFullYear();
        dateString = yyyy + "-" + mm + "-" + dd;

        return dateString
  }
  getCountryList(country_id='') {
    this._superAdminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const countryList = result.body?.list;
        countryList.map((country)=>{
          this.countryList.push(
            {
              label :country.name,
              value :country._id
            }
          )
        })
        // console.log(result, "element==>");

        result.body?.list.forEach((element) => {
          // console.log(element, "element==>");

          if (element?._id === country_id) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getRegionList(countryID: any, regionId= '') {
    this.regionList = []
    if(!countryID){
      return;
    }
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
        this.editStaff.get("region").patchValue(this.locationData?.region)
        if(!this.editStaff.get("region").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          this.editStaff.get("province").patchValue("")
          }
        result.body?.list.forEach((element) => {
          if (element?._id === regionId) {
            this.region = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any, provinceId='') {
    this.provienceList = []
    if(!regionID){
      return;
    }
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
        
        this.editStaff.get("province").patchValue(this.locationData.province)
        if(!this.editStaff.get("province").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
        result.body?.list.forEach((element) => {
          if (element?._id === provinceId) {
            this.province = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any, departmentId='') {
    this.departmentList = []
    if(!provinceID){
      return;
    }
    this._superAdminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const departmentList = result.body?.list;
        departmentList.forEach(department => {
          const exists = this.departmentList.findIndex(item => item.label === department?.name && item.value === department?._id) !== -1;
          if (!exists) {
            this.departmentList.push({
              label: department?.name,
              value: department?._id,
            });
          }
        });
        this.editStaff.get("department").patchValue(this.locationData.department)
        if(!this.editStaff.get("department").value){
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
        result.body?.list.forEach((element) => {
          if (element?._id ===departmentId) {
            this.department = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any, cityId = '',villageId='') {
    this.villageList = [];
    this.cityList = [];
    if(!departmentID){
      return;
    }
    this._superAdminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const cityList = result.body.list;
        cityList.forEach(city => {
          const exists = this.cityList.findIndex(item => item.label === city?.name && item.value === city?._id) !== -1;
          if (!exists) {
            this.cityList.push({
              label: city?.name,
              value: city?._id,
            });
          }
        });
        this.editStaff.get("city").patchValue(this.locationData.city)
        result.body?.list.forEach((element) => {
          if (element?._id ===cityId) {
            this.city = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._superAdminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const villageList = result.body.list;
        villageList.forEach(village => {
          const exists = this.villageList.findIndex(item => item.label === village?.name && item.value === village?._id) !== -1;
          if (!exists) {
            this.villageList.push({
              label: village?.name,
              value: village?._id,
            });
          }
        });
        this.editStaff.get("village").patchValue(this.locationData.village)
        result.body?.list.forEach((element) => {
          if (element?._id === villageId) {
            this.village = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      // console.log("spokenlanguage", response);
      // this.spokenLanguages = response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;
      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });  
      this.editStaff.patchValue({
        language: this.selectedLanguages
     });
      // console.log("spokenlanguage", this.spokenLanguages);
    });
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };


  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
    console.log(this.selectedLanguages,"selectedLanguages_____");
    
  }

  handleToggleChangeForActive(notificationData: any, event: any) {
    console.log(event,"notificationData--->>>>>",notificationData);
    this.notificationData = {
      id: notificationData?.for_portal_user?._id,
      notification: event,
    };
    if (event === false) {
      this.notificationStatus = "don't want";
    } else {
      this.notificationStatus = "want";
    }
    this.modalService.open(this.activateDeactivate);
  }

  updateNotificationStatus() {
    console.log("notificationData DATA===>", this.notificationData);
    this._insuranceService.updateNotification(this.notificationData).subscribe((res: any) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log(":response>>>>>>>>>>>",response)
      if (response.status) {
        this._coreService.showSuccess("",response.message);
        this.modalService.dismissAll("Closed");
      }
    });
  }
}
