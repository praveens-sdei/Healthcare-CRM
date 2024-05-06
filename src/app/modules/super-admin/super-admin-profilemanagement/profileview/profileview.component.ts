import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../super-admin.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import intlTelInput from "intl-tel-input";
import Validation from 'src/app/utility/validation';
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileviewComponent implements OnInit {
  userData: any;
  userRole: any;
  staffID: any;
  staffData: any;
  editStaff: any = FormGroup;
  iti: any;
  isSubmitted: boolean = false;
  changePasswordForm: any = FormGroup;
  @ViewChild('editstaffcontent') editstaffcontent: TemplateRef<any>;
  @ViewChild('editassociationgroup') editassociationgroup: TemplateRef<any>;

  autoComplete: google.maps.places.Autocomplete;
  @ViewChild("countryPhone") countryPhone: ElementRef<HTMLInputElement>;
  selectedCountryCode: string;
  countrycodedb: any = '';
  loc: any = {};
  selectedLanguages: any = [];
  staffProfileUrl: any;
  staffRole: any;
  groupID: any;
  groupData: any;
  searchText: any = "";
  pharmacyList: any[] = [];
  relatedPharmacies: any[] = [];
  selectedPharmacy: any[] = [];
  association_group_selected_pharmacy: any; //coma seperated
  groupIcon: any = "";
  locationData : any = {};

  constructor(private coreService: CoreService, private fb: FormBuilder, private modalService: NgbModal, private service: SuperAdminService,private toastr: ToastrService,private router: Router,
    private loader: NgxUiLoaderService) {
    const loginData = this.coreService.getLocalStorage("loginData");
    const adminData = this.coreService.getLocalStorage("adminData");

    this.userData = loginData
    this.userRole = loginData?.role;
    if(this.userRole == 'STAFF_USER'){      
      this.staffID = adminData?._id
    }else{
      this.groupID = adminData?._id
    }
    
    // console.log("this.userId", this.staffID, "SUPERRRR", this.userRole);

    this.changePasswordForm = this.fb.group(
      {
        old_password: ["", [Validators.required]],
        new_password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            Validation.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            Validation.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            Validation.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            Validation.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true,
              }
            ),
            Validators.minLength(8),
          ]),
        ],
        confirm_password: ["", [Validators.required]],
      },
      { validators: [Validation.match("new_password", "confirm_password")] }
    );



    this.editStaff = this.fb.group({
      staff_profile: [""],
      staff_name: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      language: ["", [Validators.required]],
      address: ["", [Validators.required]],
      neighbourhood: [""],
      country: ["", [Validators.required]],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      village: [""],
      pincode: [""],
      // degree: [""],
      mobile: ["", [Validators.required]],
      email: ["", [Validators.required]],
      // role: [""],
      // userName: [""],
      about_staff: [""],
    });
  }

  ngOnInit(): void {
    this.getStaffDetails();
    this.getCountryList();
    this.roleList();
    this.getSpokenLanguage();
    this.viewAssociationGroup();
    this.listAllPharmacy();
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
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

  getStaffDetails() {
    if (this.staffID === null || this.staffID === undefined) {
      return;
    }
    this.service.getStaffDetails(this.staffID).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      this.staffData = response?.data?.data[0];
      // this.relatedStaff = response.data[1]?.pharmacy_details;

      this.staffProfileUrl = response?.data?.documentURL;

      // let expiryDate = moment(this.groupData?.license_expiry).format("MM/DD/YYYY")
      // console.log(expiryDate)
      let address = response?.data?.data[0]?.location_id
      this.locationData = address
      console.log(this.locationData ,"kkkk");
      
  
      let details = response?.data?.data[0];
      this.selectedLanguages = details.language;
       
      // console.log(this.selectedLanguages, "detailsss___");

      // console.log("superadmin------stafff------>", details);
      let dateString: any = new Date(details?.dob);
      let dd = String(dateString.getDate()).padStart(2, "0");
      let mm = String(dateString.getMonth() + 1).padStart(2, "0");
      let yyyy = dateString.getFullYear();
      dateString = yyyy + "-" + mm + "-" + dd;
      // console.log("dateStringdateString", dateString);

      this.getRegionList(address?.country?._id);
      this.getProvienceList(address?.region?._id);
      this.getDepartmentList(address?.province?._id);
      this.getCityList(address?.department?._id);

      this.editStaff.controls["staff_name"].setValue(
        details?.superadmin_id?.first_name + " " + details?.superadmin_id?.middle_name + " " + details?.superadmin_id?.last_name
      );
      this.editStaff.controls["first_name"].setValue(
        details?.superadmin_id?.first_name
      );
      this.editStaff.controls["middle_name"].setValue(
        details?.superadmin_id?.middle_name
      );
      this.editStaff.controls["last_name"].setValue(
        details?.superadmin_id?.last_name
      );
      this.editStaff.controls["dob"].setValue(dateString);
      this.editStaff.controls["language"].setValue(details.language);
      this.editStaff.controls["address"].setValue(
        details?.location_id?.address
      );
      this.editStaff.controls["neighbourhood"].setValue(
        details?.location_id?.neighborhood
      );
      this.editStaff.controls["country"].setValue(address?.country?._id);
      this.editStaff.controls["region"].setValue(address?.region?._id);
      this.editStaff.controls["province"].setValue(address?.province?._id);
      this.editStaff.controls["department"].setValue(address?.department?._id);
      this.editStaff.controls["city"].setValue(address?.city?._id);
      this.editStaff.controls["village"].setValue(address?.village?._id);
      this.editStaff.controls["pincode"].setValue(
        details.location_id.pincode
      );
      // this.editStaff.controls["degree"].setValue(
      //   details.superadmin_id.degree
      // );
      this.editStaff.controls["mobile"].setValue(
        details.superadmin_id?.mobile
      );
      this.editStaff.controls["email"].setValue(details.superadmin_id.email);
      // this.editStaff.controls["role"].setValue(details?.staff_role?._id);
      // this.editStaff.controls["userName"].setValue(
      //   details.superadmin_id.user_name
      // );
      this.editStaff.controls["about_staff"].setValue(details?.about_staff);
      this.countrycodedb = details.superadmin_id.country_code;
      // this.getCountrycodeintlTelInput();
    });
  }

  openVerticallyCenterededitstaff(editstaffcontent: any) {


    this.getStaffDetails();
    this.modalService.open(editstaffcontent, {
      centered: true,
      size: "xl",
      windowClass: "edit_staffnew",
    });
  }

  handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    // this.staffID = "";
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
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }


  updateStaff() {
    this.isSubmitted = true;
    // console.log(this.editStaff.invalid, "this.editStaff.invalid");
    if (this.editStaff.invalid) {
      this.coreService.showError("", "Please Fill All Fields!")
      return null;
    }

    let formaData: any = new FormData();
    let data = this.editStaff.value;
    // console.log("checking", data);
    formaData.append("staff_profile", data.staff_profile);
    formaData.append("staff_name", data.first_name + " " + data.middle_name + " " + data.last_name);
    formaData.append("first_name", data.first_name);
    formaData.append("middle_name", data.middle_name);
    formaData.append("last_name", data.last_name);
    formaData.append("dob", data.dob);
    formaData.append("language", JSON.stringify(this.selectedLanguages));
    formaData.append("address", data.address);
    formaData.append("neighborhood", data.neighbourhood);
    formaData.append("country", data.country);
    formaData.append("region", data.region ? data.region : "");
    formaData.append("province", data.province ? data.province : "");
    formaData.append("department", data.department ? data.department : "");
    formaData.append("city", data.city ? data.city : "");
    formaData.append("village", data.village ? data.village : "");
    formaData.append("pincode", data.pincode);
    formaData.append("mobile", data.mobile);
    formaData.append("email", data.email);
    formaData.append("about_staff", data?.about_staff);
    formaData.append("id", this.staffID);
    formaData.append("country_code", this.selectedCountryCode);
    formaData.append("userId", this.staffID);
    for (let [key, value] of formaData) {
      // console.log(key, "----->", value);
    }

    this.service.editStaff(formaData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData(res);
        // console.log("response======", response)
        if (response.status) {
          this.coreService.showSuccess("", response.message);
          this.handleClose();
          this.getStaffDetails();

        } else {
          this.coreService.showError("", response.message);
        }
      },
      (err) => {
        let response = this.coreService.decryptObjectData({ data: err.error });
        this.coreService.showError("", response.message);

      }
    );
  }
  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];

      this.editStaff.patchValue({
        staff_profile: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.staffProfileUrl = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  handleRemoveLogo() {
    this.staffProfileUrl = ''
  }
  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
    // console.log(this.selectedLanguages, "selectedLanguages_____");

  }

  roleList() {
    if (this.staffID === null || this.staffID === undefined) {
      return;
    }
    let reqData = {
      page: 1,
      limit: 0,
      searchText: "",
      userId: this.staffID,
    };
    this.service.allRoleSuperAdmin(reqData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this.coreService.decryptObjectData(encryptedData);
        // console.log("response----->", response);
        this.staffRole = response?.body?.data

      })

  }

  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];

  getSpokenLanguage() {
    this.service.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      // console.log("spokenlanguage", response);
      this.spokenLanguages = response.body?.spokenLanguage;
    });
  }
  getCountryList() {
    this.service.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const countryList = result.body?.list;
        countryList.map((country)=>{
          this.countryList.push(
            {
              label :country.name,
              value :country._id
            }
          )
        })
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    if (countryID === undefined) {
      return;
    }
    this.service.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("region").patchValue(this.locationData?.region?._id)
        if(!this.editStaff.get("region").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          this.editStaff.get("province").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    this.provienceList = []
    if (!regionID) {
      return;
    }
    this.service.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("province").patchValue(this.locationData?.province?._id)
        if(!this.editStaff.get("region").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if (!provinceID) {
      return;
    }
    this.service.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("department").patchValue(this.locationData?.department?._id)
        if(!this.editStaff.get("department").value){
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.cityList=[];
    this.villageList =[];
    if (!departmentID) {
      return;
    }
    this.service.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("city").patchValue(this.locationData?.city?._id)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.service.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("village").patchValue(this.locationData?.village?._id)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  handleChangePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      id: this.userData?._id,
      old_password: this.changePasswordForm.value.old_password,
      new_password: this.changePasswordForm.value.new_password,
    };

    // console.log("Request Data====>", reqData);

    this.service.changePassword(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("Password change response===>", response)
      if (response.status) {
        this.coreService.showSuccess("", response.message)
        this.changePasswordForm.reset();
      } else {
        this.coreService.showError("", response.message)
      }
    }, err => {
      let errResponse = this.coreService.decryptObjectData({ data: err.error });
      this.coreService.showError("", errResponse.message)
    })
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  /***************************************association_group_profile***********************************************/


  viewAssociationGroup() {
    if(this.groupID == undefined){
      return;
    }
    this.service.viewAssociationGroup(this.groupID).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      this.groupData = response.data[0];
      // console.log("Group Details-->", response.data);
      this.groupIcon = response?.data[0]?.association_group_icon?.url;
      this.relatedPharmacies = response.data[1]?.pharmacy_details;
      for (let pharmacy of this.relatedPharmacies) {
        this.selectedPharmacy.push(pharmacy.portal_user_id);
      }
      this.association_group_selected_pharmacy = this.selectedPharmacy.join(',')
    });
  }

  listAllPharmacy() {
    this.service.listPharmacy(this.searchText).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      // console.log(response?.data, 'response?.data');

      this.pharmacyList = response?.body;

    });
  }

  handleUpdatePharmacy() {
    this.isSubmitted = true;
    if (this.association_group_selected_pharmacy?.length < 1) {
      this.toastr.error("Select Any Pharmacy");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      association_group_data: this.association_group_selected_pharmacy,
      id: this.groupID,
    };

    // console.log(reqData,'handleUpdatePharmacy');
    // return;
    // console.log(reqData, "check reqdata123");

    this.service.editPharmacyForAssociationGroup(reqData).subscribe(
      (res) => {
        // console.log(res, "check res of edit");

        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup()
          this.viewAssociationGroup()
        }
      },
      (err) => {
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errorResponse.message);
      }
    );
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.listAllPharmacy();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.selectedPharmacy.splice(0);
    this.association_group_selected_pharmacy = null;

    for (let pharmacy of this.relatedPharmacies) {
      this.selectedPharmacy.push(pharmacy.portal_user_id);
    }
  }

  //  Order Medicine modal
  openVerticallyCenterededitpharmacy(editpharmacycontent: any) {
    this.modalService.open(editpharmacycontent, {
      centered: true,
      windowClass: "add_pharmacy",
    });
  }

 //-------------Pharmacy selection handling-------------
  toggle(item, event: MatCheckboxChange) {
    // console.log('toggle called',item);

    if (event.checked) {
      this.selectedPharmacy.push(item?.for_portal_user);
    } else {
      const index = this.selectedPharmacy.indexOf(item?.for_portal_user);
      if (index >= 0) {
        this.selectedPharmacy.splice(index, 1);
      }
    }
    this.association_group_selected_pharmacy = this.selectedPharmacy.join(",");
  }

  exists(id) {
    return this.selectedPharmacy.indexOf(id) > -1;
  }

  isIndeterminate() {
    return this.selectedPharmacy.length > 0 && !this.isChecked();
  }

  isChecked() {

    return this.selectedPharmacy.length === this.pharmacyList.length;
  }

  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.pharmacyList.forEach((pharmacy) => {
        this.selectedPharmacy.push(pharmacy?.portal_user_id);
      });
    } else {
      this.selectedPharmacy.length = 0;
    }
  }


  openVerticallyCenterededitassociationgroup(editassociationgroup: any) {


    this.getStaffDetails();
    this.modalService.open(editassociationgroup, {
      centered: true,
      size: "xl",
      windowClass: "edit_staffnew",
    });
  }

  routeToEdit(){
    this.router.navigate([`/super-admin/profile/edit-association/${this.groupID}`])
  }
}
