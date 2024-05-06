import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import Validation from "src/app/utility/validation";
import { Router } from "@angular/router";
import intlTelInput from "intl-tel-input";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SuperAdminService } from "../../../super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { HospitalService } from "../../hospital.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { keyframes } from "@angular/animations";
import { isThisWeek } from "date-fns";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddComponent implements OnInit {
  isSubmitted: boolean = false;
  addStaff: FormGroup;
  selectedCountryCode: any = "+226";
  iti: any;
  loc: any = {};
  userID: any;
  staff_profile: any;
  staff_profile_file: FormData = null;
  @ViewChild("countryPhone") countryPhone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  teams = new FormControl("");
  departmentStaff: any[] = [];
  departmentName: any = "";
  maxDate = new Date();
  pageSize: number = 10;
  page: any = 1;
  searchText: any = ''

  dropdownList = [];
  selectedItems = [];
  selectedItems1 = [];

  dropdownSettings: IDropdownSettings;
  dropdownSettings2: IDropdownSettings
  patchCountry: any;
  selectedLanguages: any = [];
  selectedSpecialities: any = [];
  hide1 = true;
  hide2 = true;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private _hospitalService: HospitalService,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.addStaff = this.fb.group(
      {
        staff_name: [""],
        first_name: ["", [Validators.required]],
        middle_name: [""],
        last_name: ["", [Validators.required]],
        dob: ["", [Validators.required]],
        language: [""],
        address: ["", [Validators.required]],
        neighborhood: [""],
        city: [""],
        village: [""],
        country: ["", [Validators.required]],
        pincode: [""],
        degree: [""],
        phone: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        unit: [""],
        services: [""],
        staffDepartment: [""],
        region: [""],
        province: [""],
        department: [""],
        expertise: [""],
        specialty: [""],
        role: ["", [Validators.required]],
        addDoctor: [""],
        aboutStaff: [""],
        password: ["", [Validators.required]],
        confirmPassword: ["", [Validators.required]],
        doj: [new Date()]
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
  }

  ngOnInit(): void {
    this.getSpokenLanguage();
    this.getCountryList();
    this.getStaffRoles();
    this.getUnits();
    this.getAllDepartment();
    this.getAllServiceList();
    this.getAllDoctors();
    this.getSpecialty();
    this.getExpertiseApi()
    this.getAllHospitalDoctor();

    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: '_id',
    //   textField: 'full_name',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };

    // this.dropdownSettings2 = {
    //   singleSelection: false,
    //   idField: '_id',
    //   textField: 'department',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
  }

  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.addStaff.controls;
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  autoComplete: google.maps.places.Autocomplete;

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

  onGroupIconChange(event: any) {
    const formData: any = new FormData();
    formData.append("docName", event.target.files[0]);
    formData.append("userId", this.userID);
    formData.append("docType", "Hospital-Pic");
    formData.append("multiple", "false");

    this.staff_profile_file = formData;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.staff_profile = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  keyURL: any = "";
  async onSubmit() {
    this.isSubmitted = true;
    if (this.addStaff.invalid) {
      this.addStaff.markAllAsTouched();
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid'
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this._coreService.showError("", "Please fill required fields.")
      return;
    }
    // if (this.addStaff.invalid) {
    //   const invalid = [];
    //   const controls = this.addStaff.controls;
    //   for (const name in controls) {
    //     if (controls[name].invalid) {
    //       invalid.push(name);
    //     }
    //   }

    //   return;
    // }
    this.isSubmitted = false;
    if (this.staff_profile_file) {
      this._hospitalService.uploadDoc(this.staff_profile_file).subscribe({
        next: async (res: any) => {
          let result = await this._coreService.decryptObjectData({ data: res });
          this.keyURL = result.data[0].key;
          this.addStaffData();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else { this.addStaffData(); }
  }

  addStaffData() {
    this.loader.start();
    let raw = {
      staff_name: this.addStaff.value.first_name + " " + this.addStaff.value.middle_name + " " + this.addStaff.value.last_name,
      first_name: this.addStaff.value.first_name,
      middle_name: this.addStaff.value.middle_name,
      last_name: this.addStaff.value.last_name,
      dob: this.addStaff.value.dob,
      // language: [this.addStaff.value.language],
      language: this.selectedLanguages,
      addressInfo: {
        loc: this.loc,
        address: this.addStaff.value.address,
        neighborhood: this.addStaff.value.neighborhood,
        country: this.addStaff.value.country ? this.addStaff.value.country : null,
        region: this.addStaff.value.region ? this.addStaff.value.region : null,
        province: this.addStaff.value.province ? this.addStaff.value.province : null,
        department: this.addStaff.value.department ? this.addStaff.value.department : null,
        city: this.addStaff.value.city ? this.addStaff.value.city : null,
        village: this.addStaff.value.village ? this.addStaff.value.village : null,
        pincode: this.addStaff.value.pincode,
      },
      email: this.addStaff.value.email.toLowerCase(),
      role: this.addStaff.value.role,
      assignToDoctor: this.addStaff.value.addDoctor
        ? this.addStaff.value.addDoctor
        : [],
      password: this.addStaff.value.password,
      assignToStaff: [],
      aboutStaff: this.addStaff.value.aboutStaff,
      // specialty: this.addStaff.value.specialty ? this.addStaff.value.specialty : null,
      specialty: this.selectedSpecialities ? this.selectedSpecialities : null,

      services: this.addStaff.value.services ? this.addStaff.value.services : null,
      department: this.addStaff.value.staffDepartment ? this.addStaff.value.staffDepartment : null,
      unit: this.addStaff.value.unit ? this.addStaff.value.unit : null,
      expertise: this.addStaff.value.expertise ? this.addStaff.value.expertise : null,
      countryCode: this.selectedCountryCode,
      mobile: this.addStaff.value.phone,
      profilePic: this.keyURL,
      creatorId: this.userID,
      doj: this.addStaff.value.doj
    };

    this._hospitalService.addStaff(raw).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, '')
          this.route.navigate(["hospital/staffmanagement"]);
        } else {
          this.loader.stop();
          this._coreService.showError(result.message, '');
        }

      },
      error: (err) => {
        console.log(err);
      },
    });


  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;;
  };

  // api calling for form

  spokenLanguages: any[] = [];
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  staffRoleList: any[] = [];
  unitList: any[] = [];
  staffDepartmentList: any[] = [];
  serviceList: any[] = [];
  doctorList: any[] = [];
  hospDoctorList: any[] = [];
  specialtyList: any[] = [];
  expertiseList: any[] = [];
  overlay: false;
  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // this.spokenLanguages = response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;
      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });
      this.addStaff.patchValue({
        language: this.selectedLanguages
      });
    });
  }
  getCountryList() {
    this.countryList = []
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
        let data = this.countryList.map((ele) => {
          if (ele.label === "Burkina Faso") {
            this.patchCountry = ele.value;
          }
        })
        if (this.patchCountry != '') {
          this.getRegionList(this.patchCountry);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getRegionList(countryID: any) {
    this.regionList = []
    if (!countryID) {
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

    this._superAdminService
      .getDepartmentListByProvinceId(provinceID)
      .subscribe({
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
    this.villageList = []
    this.cityList = []
    if (!departmentID) {
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
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._superAdminService
      .getVillageListByDepartmentId(departmentID)
      .subscribe({
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

  getStaffRoles() {
    let param = {
      userId: this.userID,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this._hospitalService.allRoles(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });

        const staffRoleList = result?.body?.data;
        staffRoleList.map((role)=>{
          this.staffRoleList.push(
            {
              label : role.name,
              value : role._id
            }
          )
        })

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUnits() {
    let params = {
      added_by: this.userID,
      limit: 0,
      page: 0,
      searchText: "",
      for_service: "",
    };
    this._hospitalService.getUnits(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.unitList = result?.body.data;

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllServiceList() {
    let params = {
      added_by: this.userID,
      limit: 0,
      page: 0,
      searchText: "",
      for_department: "",
    };
    this._hospitalService.getAllService(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.serviceList = result?.body.data;

      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllDepartment() {
    let params = {
      added_by: this.userID,
      limit: 0,
      page: 0,
      searchText: "",
    };
    this._hospitalService.getAllDepartment(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.staffDepartmentList = result?.body.data;

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllDoctors() {
    let params = {
      // added_by: this.userID,
      limit: 10,
      page: 1,
      searchText: "",
      status: "PENDING",
    };
    this._hospitalService.getAllDoctor(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.doctorList = result?.data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllHospitalDoctor() {
    let params = {
      // added_by: this.userID,
      hospital_portal_id: this.userID,
      doctor_name: ""

    };
    this._hospitalService.getAllDoctorOfHospital(params).subscribe({
      next: async (res) => {

        let result = await this._coreService.decryptObjectData({ data: res });
        this.hospDoctorList = await result.body.result;



      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // onItemSelect(item: any) {
  //   console.log("==============>", item, this.selectedItems);

  // }
  // onSelectAll(items: any) {
  //   console.log(items);
  // }
  async onDepartmentSelect(data: any) {
    let params = {
      inputType: "department",
      added_by: this.userID,
      inputValue: data,
    };

    this._hospitalService.getDepartment_service_units(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });

        this.serviceList = result.body.serviceDetails;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onSelectAll1(items: any) {
    console.log(items);
  }

  onServiceSelect(data: any) {
    let params = {
      inputType: "service",
      added_by: this.userID,
      inputValue: data,
    };

    this._hospitalService.getDepartment_service_units(params).subscribe({
      next: (res) => {
        let dep = [];
        let result = this._coreService.decryptObjectData({ data: res });
        for (let id of result.body.departmentDetails) {
          dep.push(id._id);
        }
        this.unitList = result.body.unitDetails;
        this.addStaff.controls["staffDepartment"].setValue(dep);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onUnitSelect(data: any) {
    let params = {
      inputType: "unit",
      added_by: this.userID,
      inputValue: data,
    };

    this._hospitalService.getDepartment_service_units(params).subscribe({
      next: (res) => {
        let dep = [];
        let ser = [];
        let result = this._coreService.decryptObjectData({ data: res });
        for (let id of result.body.departmentDetails) {
          dep.push(id._id);
        }

        for (let id of result.body.serviceDetails) {
          ser.push(id._id);
        }
        this.addStaff.controls["staffDepartment"].setValue(dep);
        this.addStaff.controls["services"].setValue(ser);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSpecialty() {
    let param = {
      searchText: "",
      limit: 50,
      page: 1,
    };
    this._superAdminService.listSpeciality(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // this.specialtyList = result.body?.data;
        const arr = result.body?.data;
        arr.map((curentval: any) => {
          this.specialtyList.push({
            label: curentval?.specilization,
            value: curentval?._id,
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getExpertiseApi() {
    this.expertiseList = []
    let param = {
      searchText: "",
      limit: 50,
      page: 1,
      added_by: this.userID,
    };
    this._hospitalService.getExpertiseApi(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const expertiseList = result.body?.data;
        expertiseList.map((expertise)=>{
          this.expertiseList.push(
            {
              label : expertise?.expertise,
              value :expertise?._id
            }
          )
          })
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeSelectpic() {
    this.staff_profile = "";
  }

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.addStaff.value.language;
  }

  onSpecialityChange(event: any): void {
    this.selectedSpecialities = this.addStaff.value.specialty;
    console.log("this.selectedSpecialities>>>>>>>>>>", this.selectedSpecialities)
  }
}
