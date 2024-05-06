import { EMPTY } from "rxjs";
import { SuperAdminService } from "./../../super-admin.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Validation from "src/app/utility/validation";
import { MatCheckboxChange } from "@angular/material/checkbox";
import intlTelInput from "intl-tel-input";
import { AuthService } from "src/app/shared/auth.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-associationgroupadd",
  templateUrl: "./associationgroupadd.component.html",
  styleUrls: ["./associationgroupadd.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssociationgroupaddComponent implements OnInit {
  associationForm: FormGroup;
  adminId: any;
  isSubmitted: any = false;
  searchText: any = "";
  hospitalPharmacyList: any[] = [];
  selectedPharmacy: any[] = [];
  association_group_selected_pharmacy: any; //coma seperated
  groupIcon: any;
  iti: any;
  selectedCountryCode: any ="+226";

  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];
  groupType: any = "";
  selectedLanguages:any = [];

  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  patchCountry: any;
  loginId: any;
  userRole: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private router: Router,
    private toastr: ToastrService,
    private sadminService: SuperAdminService,
    private auth:AuthService,
    private loader: NgxUiLoaderService
  ) {
    this.associationForm = this.fb.group(
      {
        group_name: ["", [Validators.required]],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ],
        ],
        language: ["", [Validators.required]],
        mobile_phone: [
          "",
          [
            Validators.required,
            /* Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$") */,
          ],
        ],
        additional_phone: [""],
        address: ["", [Validators.required]],
        neighborhood: [""],
        country: ["", [Validators.required]],
        region: [""],
        provience: [""],
        department: [""],
        city: ["" ],
        village: [""],
        pincode: [""],
        password: [
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
        association_group_type: ["", [Validators.required]],
        about_group: [""],
        group_slogan: [""],
        license_number: [""],
        license_expiry: [""],
        license_card_id_proof: [""],
        association_group_icon: [""],
        bank_name: [""],
        bank_account_holder_name: [""],
        bank_account_number: [""],
        bank_ifsc_code: [""],
        bank_address: [""],
        mobilepay_provider_name: [""],
        mobilepay_provider_number: [
          ""
        ],
      },
      { validators: [Validation.match("password", "confirm_password")] }
    );
  }

  ngOnInit(): void {
    let loginUser = this._coreService.getLocalStorage("loginData");
    const userAdminData = this._coreService.getLocalStorage('adminData')

    this.loginId = loginUser._id;
    this.userRole = loginUser?.role;

    if(this.userRole === 'STAFF_USER'){
      this.adminId = userAdminData?.for_staff
    }else{
      this.adminId = this.loginId
    }



    this.getCountryList();
    this.getSpokenLanguage()
  }
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  autoComplete: google.maps.places.Autocomplete
   loc: any = {};

  ngAfterViewInit() {
    const input = this.phone.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: "BF",
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;

    const options = {

      fields: ["address_components", "geometry.location", "icon", "name","formatted_address"],
      strictBounds: false,
    };
    this.autoComplete = new google.maps.places.Autocomplete(this.address.nativeElement, options)
    this.autoComplete.addListener("place_changed", (record) => {
      const place = this.autoComplete.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()]
      this.associationForm.patchValue({ address: place.formatted_address })

    })
  }

  listAllPharmacy() {
    this.service.listPharmacy(this.searchText).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      let data = []
      for (const result of response.body) {
        data.push({
          _id: result.for_portal_user,
          name: result.pharmacy_name
        })
      }
      this.hospitalPharmacyList = data;
    });
  }

  listAllHospital() {
    this.service.listHospital(this.searchText).subscribe({
      next: (res) => {
        let response = this._coreService.decryptObjectData({data:res});
        let data = []
        for (const result of response.body) {
          data.push({
            _id: result.portal_user_id,
            name: result.hospital_name
          })
        }
        this.hospitalPharmacyList = data;
      },
      error: (err) => {
        let response = this._coreService.decryptObjectData({data: err.error});
        if (response.message === 'Token Expire') {
          this.auth.logout();
        }
      }
    });
  }

  handleSubmit() {
    let data = this.associationForm.value;
    if (this.selectedPharmacy.length < 1) {
      this.toastr.error(`Please select ${data.association_group_type == 'pharmacy' ? 'pharmacy' : 'hospital'}`);
      return;
    }
    this.loader.start();
    let formData: any = new FormData();
    formData.append("group_name", data.group_name);
    formData.append("license_card_id_proof", data.license_card_id_proof);
    formData.append("association_group_icon", data.association_group_icon);
    formData.append("email", data.email);
    formData.append("language", JSON.stringify(this.selectedLanguages));
    formData.append("mobile_phone", data.mobile_phone);
    formData.append("additional_phone", data.additional_phone);
    formData.append("address", data.address);
    formData.append("neighborhood", data.neighborhood);
    formData.append("country", data.country);
    formData.append("region", data.region);
    formData.append("province", data.provience);
    formData.append("department", data.department);
    formData.append("city", data.city);
    formData.append("village", data.village);
    formData.append("pincode", data.pincode);
    formData.append("password", data.password);
    formData.append("association_group_type", data.association_group_type);
    formData.append(
      "association_group_data",
      this.association_group_selected_pharmacy
    );
    formData.append("about_group", data.about_group);
    formData.append("group_slogan", data.group_slogan);
    formData.append("license_number", data.license_number);
    formData.append("license_expiry", data.license_expiry);
    formData.append("bank_name", data.bank_name);
    formData.append("bank_account_holder_name", data.bank_account_holder_name);
    formData.append("bank_account_number", data.bank_account_number);
    formData.append("bank_ifsc_code", data.bank_ifsc_code);
    formData.append("bank_address", data.bank_address);
    formData.append("mobilepay_provider_name", data.mobilepay_provider_name);
    formData.append("mobilepay_number", data.mobilepay_provider_number);
    formData.append("country_code", this.selectedCountryCode);
    formData.append("userId", this.adminId);
    formData.append("createdBy", this.loginId);

  
    this.service.addAssociationGroup(formData).subscribe(
      (res) => {
        try {
          let response = this._coreService.decryptObjectData(res);
          if (response.status) {
            this.loader.stop();
            this.toastr.success(response.message);
            this.router.navigate(["super-admin/associationgroup"]);
            this.closePopup();
          } else {
            this.loader.stop();
            this.toastr.error(response.message);
          }
        } catch (err) {
          this.loader.stop();
          throw err;
        }
      },
      (err) => {
        let response = this._coreService.decryptObjectData({ data: err.error });
        this.toastr.error(response.message);
        this.loader.stop();
      }
    );
  }

  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.associationForm.patchValue({
        association_group_icon: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.groupIcon = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFileChnage(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.associationForm.patchValue({
        license_card_id_proof: file,
      });
    }
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    if (this.groupType === 'pharmacy') {
      this.listAllPharmacy();
    } else {
      this.listAllHospital()
    }
  }

  handleGroupTypeChange(value: any) {
    this.groupType = value
    if (value === 'pharmacy') {
      this.listAllPharmacy();
    } else if (value === 'hospital') {
      this.listAllHospital()
    }
  }

  get f() {
    return this.associationForm.controls;
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.selectedPharmacy.splice(0);
    this.association_group_selected_pharmacy = null;
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //  Order Medicine modal
  openVerticallyCenteredaddpharmacy(addpharmacycontent: any) {
    this.isSubmitted = true;
    if (this.associationForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.modalService.open(addpharmacycontent, {
      centered: true,
      windowClass: "add_pharmacy",
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

  //-------------Pharmacy selection handling-------------
  toggle(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedPharmacy.push(item?._id);
    } else {
      const index = this.selectedPharmacy.indexOf(item?._id);
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
    return this.selectedPharmacy.length === this.hospitalPharmacyList.length;
  }

  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.hospitalPharmacyList.forEach((pharmacy) => {
        this.selectedPharmacy.push(pharmacy?._id);
      });
    } else {
      this.selectedPharmacy.length = 0;
    }
    this.association_group_selected_pharmacy = this.selectedPharmacy.join(",");
  }

  //-----Calling address API's---------------
  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.spokenLanguages = response.body?.spokenLanguage;
    });
  }

  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
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
        let data =   countryList.map((ele)=>{
          if(ele.name === "Burkina Faso"){
            this.patchCountry = ele._id;
            // console.log("this.patchCountry",this.patchCountry);
          }
        })
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    this.regionList = []
    if(!countryID) return;
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    this.provienceList = []
    if(!regionID) return;
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(!provinceID) return;
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.cityList = [];
    this.villageList = [];
    if(!departmentID) return;
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.associationForm.value.language;
    console.log(this.selectedLanguages,"selectedLanguages_____");
    
  }

}
