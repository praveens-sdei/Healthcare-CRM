import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from "@angular/core";
import Validation from "src/app/utility/validation";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { InsuranceService } from "../../insurance.service";
import { CoreService } from "src/app/shared/core.service";
import { IInsuranceStaffResponse } from "./insurance-add-staff.type";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import intlTelInput from 'intl-tel-input';
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-addstaff",
  templateUrl: "./addstaff.component.html",
  styleUrls: ["./addstaff.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddstaffComponent implements OnInit {
  isSubmitted: boolean = false;
  addStaff: FormGroup;
  staffRole: any;
  selectedFiles: any = '';
  userID: string = ''
  iti: any;
  selectedCountryCode: any = "+226";
  staffIcon: any = ""
  @ViewChild('countryPhone') countryPhone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  langId: any;
  locationData: any;
  loc: any = {};
  pageSize: number = 10
  page: any = 1;
  searchText: any = ''
  profileImage: any = null;
  key: any;
  patchCountry: any;
  selectedLanguages: any = [];
  selectedRoles: any;
  adminID: any;
  constructor(
    private fb: FormBuilder,
    private _route: Router,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private sadminService: SuperAdminService,
    private loader: NgxUiLoaderService

  ) {
    const userData = this._coreService.getLocalStorage('loginData')
    const adminData = this._coreService.getLocalStorage('adminData')

    this.userID = userData._id

    if(userData.role === "INSURANCE_STAFF"){
      this.adminID = adminData?.for_user
    }else{
      this.adminID = this.userID
    }
    this.addStaff = this.fb.group(
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
        nationality: ["", [Validators.required]],
        region: [""],
        province: [""],
        department: [""],
        city: [""],
        village: [""],
        pincode: [""],
        degree: [""],
        mobile: ["", [Validators.required]],
        email: ["", [Validators.required]],
        role: ["", [Validators.required]],
        userName: [""],
        password: ["", [Validators.required]],
        confirmPassword: ["", [Validators.required]],
        aboutStaff: [""],
        dateofcreation:[new Date()]
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
  }

  ngOnInit(): void {
    this.getCountryList();
    this.getSpokenLanguage();
    this.getAllRole();
  }

  getAllRole() {
    let param = {
      userId: this.adminID,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this._insuranceService.allRoles(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      if (result.status) {
        this.staffRole = result?.body?.data
      console.log("this.staffRole-----------",this.staffRole);
      
      }
    });
  }

  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.addStaff.controls;
  }
  selectFile(event: any) {

    if (event.target.files && event.target.files[0]) {

      let file = event.target.files[0];
      console.log("file", file);

      const formData: FormData = new FormData();

      formData.append(
        "userId", this.userID

      );
      formData.append("docType", 'staff_profile');
      formData.append("multiple", "false");
      formData.append("docName", file);
      // this.addStaff.patchValue({
      //   staff_profile: this.selectedFiles,       
      // });
      this.selectedFiles = formData;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.staffIcon = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /*
code for country code starts
*/
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  }
  autoComplete: google.maps.places.Autocomplete;

  ngAfterViewInit() {
    const input = this.countryPhone.nativeElement;
    console.log(input);

    // const input = document.querySelector("#phone");
    this.iti = intlTelInput(input, {
      initialCountry: "BF",
      separateDialCode: true
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
      this.address?.nativeElement,
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

  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._insuranceService.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData({ data: res });
          resolve(response);
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

  async onSubmit() {
    this.isSubmitted = true;
    if (this.addStaff.valid) {

      const values = this.addStaff.value
      console.log(values, 'valuesss');
      const formaData = new FormData();
      if (this.selectedFiles !== "") {
        console.log(this.selectedFiles, "selectedFilesss____");


        await this.uploadDocuments(this.selectedFiles).then((res: any) => {

          this.key = res.data[0].Key
          console.log(this.key, "keyyyyy_______");

          formaData.append("staff_profile", this.key)
          this.addStaff.patchValue({
            staff_profile: res.data[0].Key,
          });
        });
      }

      this.loader.start();

      formaData.append("staff_name", values.first_name + " " + values.middle_name + " " + values.last_name)
      formaData.append("first_name", values.first_name)
      formaData.append("middle_name", values.middle_name)
      formaData.append("last_name", values.last_name)
      formaData.append("dob", values.dob)
      formaData.append("language", JSON.stringify(this.selectedLanguages))
      formaData.append("address", values.address)
      formaData.append("neighbourhood", values.neighbourhood)
      formaData.append("country", values.nationality)
      formaData.append("region", values.region)
      formaData.append("province", values.province)
      formaData.append("department", values.department)
      formaData.append("city", values.city)
      formaData.append("village", values.village)
      formaData.append("pincode", values.pincode)
      formaData.append("degree", values.degree)
      formaData.append("phone", values.mobile)
      formaData.append("email", values.email.toLowerCase())
      formaData.append("role", JSON.stringify(this.selectedRoles))
      formaData.append("userName", values.first_name + " " + values.middle_name + " " + values.last_name)
      formaData.append("password", values.password)
      formaData.append("confirmPassword", values.confirmPassword)
      formaData.append("aboutStaff", values.aboutStaff)
      formaData.append("for_user", this.adminID)
      formaData.append("country_code", this.selectedCountryCode)
      formaData.append("added_by", this.userID)
      formaData.append("doj", values.dateofcreation)


      formaData.forEach((key, value) => {
        console.log(key, "-->");
        console.log(value, "-->");


      })
      this._insuranceService.addStaff(formaData).subscribe({
        next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
          let decryptedResult = this._coreService.decryptObjectData(result);
          console.log(decryptedResult, 'decryptedResult');
          if (decryptedResult.status == true) {
            this.loader.stop();
            this._coreService.showSuccess("", decryptedResult.message);
            this._route.navigate(['insurance/staffmanagement']);
          } else {
            this.loader.stop();
            this._coreService.showError("", decryptedResult.message);
          }
        },
        error: (err: ErrorEvent) => {
          console.log(err, 'err');
          this.loader.stop();
          this._coreService.showError("", err.message);
          // if (err.message === "INTERNAL_SERVER_ERROR") {
          //   this.coreService.showError("", err.message);
          // }
        },
      });

      console.log("Add staff data", values);
    }
    //Serivce call here
  }

  //---------------select2 addresss----------------//
  spokenlang: boolean = false;
  city: boolean = false;
  village: boolean = false;
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];
  id: any;
  overlay: false;

  village_id: any

  getLangId(event: any) {
    console.log(event, "event");

    this.langId = event?.value;
    if (this.id) {
      this.spokenlang = true;
    }

  }

  getCityId(event: any) {
    this.id = event.value;
    if (this.id) {
      this.city = true;
    }

  }
  getVillageId(event: any) {
    this.village_id = event.value;
    if (this.id) {
      this.village = true;
    }

  }

  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log(" this.spokenLanguages", response?.body);
      // this.spokenLanguages=response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;

      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });
      // console.log(" this.spokenLanguages", this.spokenLanguages);
    });
  }


  getCountryList(type = '') {
    this.countryList = [];

    console.log("nationalityselected1", this.countryList);
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // this.countryList = result.body?.list;
        const arr = result.body?.list;

        arr.map((curentval: any) => {
          this.countryList.push({
            label: curentval?.name,
            value: curentval?._id,
          });
        });
        let data = result.body?.list.map((ele) => {
          if (ele.name === "Burkina Faso") {
            this.patchCountry = ele._id;
          }

        })
        console.log("nationalityselected11", result.body?.list);

        if (type == "edit") {
          this.getRegionList(this.locationData?.country, "edit");
        }
        console.log("nationalityselected2", this.countryList);

        // console.log(" this.countryList", this.countryList);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any, type = '') {
    console.log("nationalityselectedgetRegionList", countryID, type);

    if (countryID != undefined) {
      this.regionList = [];
      this.sadminService.getRegionListByCountryId(countryID).subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          // this.regionList = result.body?.list;
          const arr = result.body?.list;

          arr.map((curentval: any) => {
            this.regionList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });
          if (type == 'edit') {
            // console.log("nationalityselected11111111111", this.regionList);

            this.getProvienceList(this.locationData?.region, 'edit');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getProvienceList(regionID: any, type = '') {
    if (regionID != undefined) {
      this.provienceList = [];
      this.sadminService.getProvinceListByRegionId(regionID).subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          // this.provienceList = result.body?.list;
          const arr = result.body?.list;

          arr.map((curentval: any) => {
            this.provienceList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getDepartmentList(provinceID: any, type = '') {
    if (provinceID != undefined) {
      this.departmentList = [];
      this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          // this.departmentList = result.body?.list;
          const arr = result.body?.list;

          arr.map((curentval: any) => {
            this.departmentList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getCityList(departmentID: any, type = '') {
    console.log("getCityIdgetCityId", departmentID);

    if (departmentID == undefined) {
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // this.cityList = result.body?.list;
        const arr = result.body?.list;
        arr.map((curentval: any) => {
          this.cityList.push({
            label: curentval?.name,
            value: curentval?._id,
          });
        });

        this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
          next: (res) => {
            let result = this._coreService.decryptObjectData({ data: res });
            // this.villageList = result.body?.list;
            const arr = result.body?.list;

            arr.map((curentval: any) => {
              this.villageList.push({
                label: curentval?.name,
                value: curentval?._id,
              });
            });
          },
          error: (err) => {
            console.log(err);
          },
        });

      },
      error: (err) => {
        console.log(err);
      },
    });


    // }

  }
  handleRemoveLogo() {
    this.staffIcon = ""
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  onSelectionChange(event: any): void {
    this.selectedLanguages = this.addStaff.value.language;
    console.log(this.selectedLanguages, "selectedLanguages___");

  }

  onSelectionChangeRole(event: any): void {
    this.selectedRoles = this.addStaff.value.role;
    console.log(this.selectedRoles, "selectedRoles");

  }
}
