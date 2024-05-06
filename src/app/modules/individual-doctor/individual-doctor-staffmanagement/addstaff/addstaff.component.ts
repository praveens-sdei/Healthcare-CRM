import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { SuperAdminService } from "../../../super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";
import Validation from "src/app/utility/validation";
import intlTelInput from "intl-tel-input";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-addstaff",
  templateUrl: "./addstaff.component.html",
  styleUrls: ["./addstaff.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddstaffComponent implements OnInit {
  addStaff: FormGroup;
  isSubmitted: boolean = false;
  staff_profile_file: FormData = null;
  staff_profile: any = "";

  selectedCountryCode: any = "+226";
  iti: any;
  loc: any = {};
  loginUserId: any = "";
  @ViewChild("countryPhone") countryPhone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  maxDate = new Date();
  pageSize: number = 10;
  page: any = 1;
  searchText :any =''
  selectedLanguages:any = [];

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  patchCountry: any;
  selectedSpecialities:any=[];

  constructor(
    private _superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private _indiviualDoctor: IndiviualDoctorService,
    private route: Router,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");

    this.loginUserId = userData._id;

    this.addStaff = this.fb.group(
      {
        staff_name: [""],
        first_name: ["", [Validators.required]],
       middle_name: [""],
        last_name: ["", [Validators.required]],
        dob: ["", [Validators.required]],
        language: [""],
        address: ["",[Validators.required]],
        neighborhood: [""],
        city: [""],
        village: [""],
        country: ["", [Validators.required]],
        pincode: [""],
        degree: [""],
        mobile: ["", [Validators.required]],
        email: ["", [Validators.required]],
        unit: [""],
        services: [""],
        staffDepartment: [""],
        region: [""],
        province: [""],
        department: [""],
        role: ["", [Validators.required]],
        specialty: ["", [Validators.required]],
        aboutStaff: [""],
        password: ["", [Validators.required]],
        confirmPassword: ["", [Validators.required]],
        doj:[new Date()]
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
  }

  ngOnInit(): void {
    this.getSpokenLanguage();
    this.getCountryList();
    this.getAllRole();
    this.getSpecialty();
  }
  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.addStaff.controls;
  }

  onGroupIconChange(event: any) {
    const formData: any = new FormData();
    formData.append("docName", event.target.files[0]);
    formData.append("userId", this.loginUserId);
    formData.append("docType", "individual_doctor_pic");
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
     
    //   this._coreService.showError("Please fill all required fields", '')    
    //   return;
      
    // }

    this.isSubmitted = false;

    console.log(this.staff_profile_file, '');
    console.log(this.addStaff.value);


    if (this.staff_profile_file != null) {

      this._indiviualDoctor.uploadDoc(this.staff_profile_file).subscribe({
        next: async (res: any) => {
          let result = await this._coreService.decryptObjectData({ data: res });
          this.keyURL = result.data[0].key;
          this.add_Staff();

          // console.log("result", result);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.add_Staff();
    }
    this.isSubmitted = false;
  }

  add_Staff() {
    this.loader.start();
    let fields = this.addStaff.value;
    let row = {
      staff_name:fields.first_name+" "+fields.middle_name+" "+fields.last_name,
      first_name:fields.first_name,
      middle_name:fields.middle_name,
      last_name:fields.last_name,
      dob: fields.dob,
      language: this.selectedLanguages,
      addressInfo: {
        loc: this.loc,
        address: fields.address,
        neighborhood: fields.neighborhood,
        country: fields.country ?fields.country: null,
        region: fields.region ? fields.region : null,
        province: fields.province ?fields.province: null,
        department: fields.department ?fields.department: null,
        city: fields.city ? fields.city: null,
        village: fields.village ? fields.village: null,
        pincode: fields.pincode,
      },
      email: fields.email.toLowerCase(),
      role: fields.role,
      assignToDoctor: [],
      password: fields.password,
      assignToStaff: [],
      aboutStaff: fields.aboutStaff,
      // specialty: fields.specialty,
      specialty:this.selectedSpecialities,
      services: [],
      department: [],
      unit: [],
      expertise: "",
      countryCode: this.selectedCountryCode,
      mobile: fields.mobile,
      profilePic: this.keyURL,
      creatorId: this.loginUserId,
      doj: fields.doj
    };

console.log("row>>>>>>>>>>",row)
    this._indiviualDoctor.addStaff(row).subscribe({
      next: async (res) => {
        let result = await this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, '');
          this._coreService.setCategoryForService(1);
          this.route.navigateByUrl('individual-doctor/staffmanagement');
          

        } else {
          this.loader.stop();
          this._coreService.showError(result.message, '');
        }
        console.log(result);

      },
      error: (err) => {
        console.log(err);
        this._coreService.showError(err.statusText, '');
        this.loader.stop();
      },
    });

  }

  removeSelectpic() {
    this.staff_profile = "";  
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

  // ----------------------------api for dropdown selection---------------------------------------
  spokenLanguages: any[] = [];
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  RoleList: any[] = [];
  specialtyList: any[] = [];
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

      // console.log(" this.spokenLanguages", this.spokenLanguages);
    });
  }
  getCountryList() {
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
        let data =   this.countryList.map((ele)=>{
          // console.log("naaaaaaaaaaaaaa", ele.name);
          if(ele.label === "Burkina Faso"){
            this.patchCountry = ele.value;
            // console.log("this.patchCountry",this.patchCountry);            
          }
          
        })
        if(this.patchCountry!='')
        {
          this.getRegionList(this.patchCountry);
        }
        // console.log(" this.countryList", this.countryList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getRegionList(countryID: any) {
    this.regionList = []
    if(!countryID){
      return;
    }
    console.log(countryID);
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        const regionList = result.body?.list;
        regionList.map((region)=>{
          this.regionList.push(
            {
              label :region.name,
              value :region._id
            }
          )
        })
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getProvienceList(regionID: any) {
    this.provienceList = []
    if(!regionID){
      return;
    }
    this._superAdminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const provienceList = result.body?.list;
        provienceList.map((province)=>{
          this.provienceList.push(
            {
              label :province.name,
              value :province._id
            }
          )
        })
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(!provinceID){
      return;
    }
    this._superAdminService
      .getDepartmentListByProvinceId(provinceID)
      .subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          const departmentList = result.body?.list;
          departmentList.map((department)=>{
            this.departmentList.push(
              {
                label :department.name,
                value :department._id
              }
            )
          })
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getCityList(departmentID: any) {
    this.cityList = []
    if(!departmentID){
      return;
    }
    this._superAdminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const cityList = result.body.list;
        cityList.map((city)=>{
          this.cityList.push(
            {
              label :city.name,
              value :city._id
            }
          )
        })
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
          villageList.map((village)=>{
            this.villageList.push(
              {
                label :village.name,
                value :village._id
              }
            )
          })
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getAllRole() {
    let param = {
      userId: this.loginUserId,
      page: 1,
      limit: 0,
      searchText: "",
    };
    
    this._indiviualDoctor.getAllRole(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const RoleList = result?.body?.data;
        RoleList.map((role)=>{
          this.RoleList.push(
            {
              label : role.name,
              value : role._id
            }
          )
        })

        console.log("roles", result);
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
        console.log("this.specialtyList >>>>>",this.specialtyList)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.addStaff.value.language;
  }

  onSpecialityChange(event:any): void {
    this.selectedSpecialities = this.addStaff.value.specialty;
    console.log("this.selectedSpecialities>>>>>>>>>>",this.selectedSpecialities)
  }

}
