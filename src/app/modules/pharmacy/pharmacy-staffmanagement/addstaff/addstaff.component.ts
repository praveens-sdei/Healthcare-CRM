import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from "@angular/core";
import Validation from "src/app/utility/validation";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import intlTelInput from "intl-tel-input";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { PharmacyStaffResponse } from "./addstaff.component.type";
import { PharmacyService } from "../../pharmacy.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: "app-addstaff",
  templateUrl: "./addstaff.component.html",
  styleUrls: ["./addstaff.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddstaffComponent implements OnInit {
  isSubmitted: boolean = false;
  addStaff: FormGroup;
  staffRole: any[] = []; 
  staffRole2 : any[] = [];
  selectedFiles: any = "";
  selectedCountryCode: any = "+226";
  iti: any;
  userID: any;
  spokenLanguages: any[] = [];
  pageSize: number = 10
  page: any = 1;
  @ViewChild("countryPhone") countryPhone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  profileIcon: any;
  searchText: any = '';
  patchCountry: any;
  selectedLanguages:any = [];

  constructor(
    private fb: FormBuilder,
    private _route: Router,
    private _pharmacyService: PharmacyService,
    private _superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this._pharmacyService.allRole(userData._id).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      console.log("result===========",result)
      if (result.status) {
        this.staffRole = result?.body;
      }
    });

    this.addStaff = this.fb.group(
      {
        staff_profile: [""],
        staff_name: [""],
        first_name: ["", [Validators.required]],
        middle_name: [""],
        last_name: ["", [Validators.required]],
        dob: ["",[Validators.required]],
        language: [""],
        address: ["", [Validators.required]],
        neighborhood: [""],
        country: ["",[Validators.required]],
        region: [""],
        province: [""],
        department: [""],
        city: [""],
        village: [""],
        pincode: [""],
        degree: [""],
        email: ["", [Validators.required]],
        role: ["", [Validators.required]],
        userName: [""],
        password: ["", [Validators.required]],
        confirmPassword: ["", [Validators.required]],
        about: [""],
        phone_number: ["",[Validators.required]],
        doj:[new Date()]
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
  }

  ngOnInit(): void {
    let admin = this._coreService.getLocalStorage("loginData");
    this.userID = admin._id;
    this.getCountryList();
    this.getAllRole();
    this.getSpokenLanguage();
  }

  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.addStaff.controls;
  }

  selectFile(file: any) {
    let image = file.target.files[0];
    this.addStaff.patchValue({
      staff_profile: image,
    });
  }

  /* Call Spoken language API */
  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.spokenLanguages = response.body?.spokenLanguage;
    });
  }

  private getAllRole() {
    let param = {
      userId: this.userID,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this._pharmacyService.allRoles(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({data:res});
      console.log("rolelist===========",result)
      if (result?.status) {
        const staffRole = result?.body?.data
        staffRole.map((role)=>{
         this.staffRole2.push(
          {
            label : role.name,
            value : role._id
          }
         )
        })
      }
    })
  }

  /*
     code for country code starts
 */
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};

  ngAfterViewInit() {
    const input = this.countryPhone.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: "BF",
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
      this.address.nativeElement,
      options
    );
    this.autoComplete.addListener("place_changed", (record) => {
      const place = this.autoComplete.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];
      this.addStaff.patchValue({ address: place.formatted_address });
    });
  }
  /*
     code for country code ends
  */

  onSubmit() {
    this.isSubmitted = true;
    const values = this.addStaff.value;
    if (this.addStaff.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this._coreService.showError("","Please fill all required fields." )
      const invalid = [];
      const controls = this.addStaff.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      return;      
    }
    // if (this.addStaff.invalid) {
    //   console.log("invalid");
    //   return;
    // }
    this.loader.start()
    const formData: any = new FormData();
    formData.append("staff_profile", values.staff_profile);
    formData.append("staff_name", values.first_name+" "+values.middle_name+" "+values.last_name);
    formData.append("first_name", values.first_name);
    formData.append("middle_name", values.middle_name);
    formData.append("last_name", values.last_name);
    formData.append("dob", values.dob);
    formData.append("language", JSON.stringify(this.selectedLanguages));
    formData.append("address", values.address);
    formData.append("neighborhood", values.neighborhood);
    formData.append("country", values.country);
    formData.append("region", values.region);
    formData.append("province", values.province);
    formData.append("department", values.department);
    formData.append("city", values.city);
    formData.append("village", values.village);
    formData.append("pincode", values.pincode);
    formData.append("degree", values.degree);
    formData.append("phone_number", values.phone_number);
    formData.append("email", values.email.toLowerCase());
    formData.append("role", values.role);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);
    formData.append("about", values.about);
    formData.append("userId", this.userID);
    formData.append("country_code", this.selectedCountryCode);
    formData.append("doj", values.doj);

    for (let [key, value] of formData) {
      console.log(key, '---->', value)
    }

    this._pharmacyService.addStaff(formData).subscribe({
      next: (result: IEncryptedResponse<PharmacyStaffResponse>) => {
        let decryptedResult = this._coreService.decryptObjectData(result);
        console.log(decryptedResult, "decryptedResult");

        if (decryptedResult.status) {
          this.loader.stop()
          this._coreService.showSuccess("", decryptedResult.message);
          this._route.navigate(["pharmacy/staffmanagement"]);
        } 
        else {
          this.loader.stop()
          this._coreService.showError("", decryptedResult.message);
        }
      },
      error: (err: ErrorEvent) => {
        let decryptedResult = this._coreService.decryptObjectData({
          data: err.error,
        });
        console.log(decryptedResult, "decryptedResult");
        this.loader.stop()
        this._coreService.showError("", decryptedResult.message);
      },
    });
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  reset() {
    // this.addStaff.reset();
    this._route.navigate(['/pharmacy/staffmanagement']);
  }

  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.addStaff.patchValue({
        staff_profile: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileIcon = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  //-----Calling address API's---------------
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  departmentList: any[] = [];

  getCountryList() {
    this._pharmacyService.getcountrylist().subscribe({
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
        let data =    this.countryList.map((ele)=>{
          if(ele.label === "Burkina Faso"){
            this.patchCountry = ele.value;
          }
          
        })
        if(this.patchCountry!='')
        {
          this.getRegionList(this.patchCountry);
        }
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    this.regionList = []
    if(countryID != null || countryID != undefined){
      this._pharmacyService.getRegionListByCountryId(countryID).subscribe({
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
          // console.log(err);
        },
      });
    }
  }

  getProvienceList(regionID: any) {
    this.provienceList = []
    if(!regionID){
      return;
    }
    this._pharmacyService.getProvinceListByRegionId(regionID).subscribe({
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
        // console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(!provinceID){
      return;
    }
    this._pharmacyService.getDepartmentListByProvinceId(provinceID).subscribe({
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
    this.cityList = []
    this.villageList = []
    if(!departmentID){
      return;
    }
    this._pharmacyService.getCityListByDepartmentId(departmentID).subscribe({
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

    this._pharmacyService.getVillageListByDepartmentId(departmentID).subscribe({
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
  removeSelectpic(){
    this.profileIcon=""

  }


  onSelectionChange(event: any): void {
    this.selectedLanguages = this.addStaff.value.language;
    console.log(this.selectedLanguages,"selectedLanguages_____");
  }

}