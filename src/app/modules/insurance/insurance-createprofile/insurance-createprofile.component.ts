import { Location } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../insurance.service";
import { SuperAdminService } from "../../super-admin/super-admin.service";
import intlTelInput from "intl-tel-input";
import { AuthService } from "src/app/shared/auth.service";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface ILocationData {
  company_name: string;
  email: string;
  countryCode: string;
  mobileNo: string;
  userId: string;
}
@Component({
  selector: "app-insurance-createprofile",
  templateUrl: "./insurance-createprofile.component.html",
  styleUrls: ["./insurance-createprofile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceCreateprofileComponent implements OnInit, OnDestroy {
  createProfile: any = FormGroup;
  faxForm: any = FormGroup;
  officePhoneForm: any = FormGroup;
  insSub: Subscription;
  mobileNo: any;
  isSubmitted: boolean = false;

  groupIcon: any = "";
  logoIcon: any = "";

  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];
  overlay:false;
  autoComplete: google.maps.places.Autocomplete;
  autoComplete2: google.maps.places.Autocomplete;
  autoComplete3: google.maps.places.Autocomplete;
  loc: any = {};
  iti: any;
  selectedCountryCode: any;
  showOtherInput: boolean = false;
  locations :any = {}

  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  @ViewChild("company_address") company_address!: ElementRef;
  @ViewChild("head_Office_address") head_Office_address!: ElementRef;

  profileImage: any = null;
  companyLogo: any = null;

  loginCreds: any;
  adminId: any = "";

  maxDOB: any;
  sendToHeader: any = "";
  selectedcountrycodedb: any = '';
  patchCountry: any;
  selectedLanguages:any =[];
  userId: any;
  countryCodes: string[];
  companytype: any;

  constructor(
    private fb: FormBuilder,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private dateAdapter: DateAdapter<Date>,
    private route: Router,
    private location: Location,
    private sadminService: SuperAdminService,
    private auth: AuthService,
    private toastr : ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.dateAdapter.setLocale("en-US");
    this.createProfile = this.fb.group({
      id: [""],
      profile_pic: [""],
      full_name: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["",[Validators.required]],
      // role: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      phone: [
        "",
        [Validators.required],
      ],
      language: [""],
      address: ["", [Validators.required]],
      neighborhood: [""],
      country: ["", [Validators.required]],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      village: [""],
      pincode: [""],
      company_logo: [""],
      company_name: [""],
      company_slogan: [""],
      company_type: ["", [Validators.required]],
      other_company_type_name:[""],
      company_address: ["", [Validators.required]],
      head_Office_address: ["", [Validators.required]],
      capital: [""],

      laws_governing: [""],
      ifu_number: [""],
      rccm_number: [""],
      other_company_number: [
        "",
        // [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      bank_name: [""],
      bank_accName: [""],
      accountNumber: [""],
      bank_ifsc: [""],
      bank_address: [""],


      


      fax: this.fb.array([]),
      office_phone: this.fb.array([]),
      mobilePayDetails: this.fb.array([])
    });

    this.countryCodes =  ["+226(BF)","+229(BJ)", "+225(CI)", "+223(ML)", "+221(SN)", "+228(TG)"];
  }

  ngOnInit(): void {
    var d = new Date();
    d.setMonth(d.getMonth());
    this.maxDOB = d;
    const locationInfo = this.location.getState() as ILocationData;

    this.adminId = JSON.parse(sessionStorage.getItem("adminId"));
    this.loginCreds = JSON.parse(sessionStorage.getItem("loginCreds"));
    const loginData= JSON.parse(sessionStorage.getItem("loginData"));
    this.userId= loginData._id;
    this.insSub = this._coreService.SharingData.subscribe((res) => {
      // console.log('subject from createprofile',res);
      this.createProfile.controls["phone"].setValue(locationInfo.mobileNo);
      this.createProfile.controls["email"].setValue(locationInfo.email);
      this.createProfile.controls["id"].setValue(locationInfo.userId);
      this.createProfile.controls["company_name"].setValue(
        locationInfo.company_name
      );
      // this.createProfile.controls['phone'].setValue(res['mobile']);
    });

    // if (locationInfo && locationInfo.userId == undefined) {
    //   this.route.navigateByUrl("/insurance/login");
    // }

    // this.addFax(), this.addPhone();

    this.getCountryList();
    this.getSpokenLanguage();
    this.getInsuranceDetails();
    // this.getCountryList();
    this.getCityList("");
    this.getRegionList("");
    this.getDepartmentList("");
    this.getProvienceList("");

    this.addMobPay();
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
  getCountryCode() {
    var country_code = '';
    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (countryData[i].dialCode === this.selectedcountrycodedb.split("+")[1]) {
        country_code = countryData[i].iso2;
        break; // Break the loop when the country code is found
      }
    }
    const input = this.phone.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: country_code,
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
  }

  ngAfterViewInit() {    

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

    //for address
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
      this.createProfile.patchValue({ address: place.formatted_address });
    });

    //for company address
    this.autoComplete2 = new google.maps.places.Autocomplete(
      this.company_address.nativeElement,
      options
    );
    this.autoComplete2.addListener("place_changed", (record) => {
      const place = this.autoComplete2.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [
        place?.geometry?.location?.lng(),
        place?.geometry?.location?.lat(),
      ];
      this.createProfile.patchValue({
        company_address: place.formatted_address,
      });
    });

    //for head office address
    this.autoComplete3 = new google.maps.places.Autocomplete(
      this.head_Office_address.nativeElement,
      options
    );
    this.autoComplete3.addListener("place_changed", (record) => {
      const place = this.autoComplete3.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [
        place?.geometry?.location?.lng(),
        place?.geometry?.location?.lat(),
      ];
      this.createProfile.patchValue({
        head_Office_address: place.formatted_address,
      });
    });
  }

  getInsuranceDetails() {
    let reqData = {
      id: this.adminId,
    };

    this._insuranceService.getProfileDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.selectedLanguages = response.body.languag;
      this.companytype = response?.body?.company_type;
      console.log(response,"response____-");

      
      if (response.status == true) {
        if (response?.body?.role === "INSURANCE_ADMIN") {
          console.log("nkjlnkjnkl");
          
          this.sendToHeader = {
            name: response?.body?.company_name,
            profile: response?.body?.profile_pic_signed_url,
          };
        }
        console.log(" this.sendToHeader__________", this.sendToHeader);
        
        if (response?.body?.office_phone?.length != 0) {
          response?.body?.office_phone.forEach((element) => {
            this.addPhone();
          });
        } else {
          this.addPhone();
        }

        if (response?.body?.fax?.length != 0) {
          response?.body?.fax.forEach((element) => {
            this.addFax();
          });
        } else {
          this.addFax();
        }

        if (response?.body?.in_mobile_pay?.mobilePay?.length != 0) {
          response?.body?.in_mobile_pay?.mobilePay.forEach((element) => {
            this.addMobPay();
          });
        } else {
          this.addMobPay();
        }
        this.createProfile.patchValue({
          ...response.body,
          email: response?.body?.for_portal_user?.email,
          phone: response?.body?.for_portal_user?.mobile,
          ...response.body?.in_location,
          role: response?.body?.role === "INSURANCE_ADMIN" ? "ADMIN" : "STAFF",
          mobilePayDetails: response?.body?.in_mobile_pay?.mobilePay
        });

        this.groupIcon = response?.body?.profile_pic_signed_url;
        this.logoIcon = response?.body?.company_logo_signed_url;
        this.selectedcountrycodedb = response?.body?.for_portal_user?.country_code

        this.getCountryCode();
      }
      this.locations = {...response.body?.in_location}
    });
  }

  numberFunc(event: any = ''): boolean {
    if (event.type === 'paste') {
      // Handle paste action
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      const pastedText = clipboardData.getData('text');
      const regex = new RegExp("^[0-9]+$");
  
      if (!regex.test(pastedText)) {
        event.preventDefault();
        return false;
      }
    } else {
      // Handle key press action
      const key = event.key;
      const regex = new RegExp("^[0-9]+$");
  
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    }
  
    return true; // Return true for allowed key press or paste
  }  

  mobilePayValidation(index) {
    let abc = this.createProfile.get("mobilePayDetails") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get mobilePayDetails() {
    return this.createProfile.controls["mobilePayDetails"] as FormArray;
  }

  addMobPay() {
    const addMobPay = this.fb.group({
      provider: [""],
      pay_number: [""],
      mobile_country_code: [this.countryCodes[0]]
    });
    this.mobilePayDetails.push(addMobPay);
  }

  removeMobPay(index: number) {
    this.mobilePayDetails.removeAt(index);
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.createProfile.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid'
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this.toastr.error("Please fill required fields.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    if (this.profileImage != null) {
      await this.uploadDocuments(this.profileImage).then((res: any) => {
        this.createProfile.patchValue({
          profile_pic: res.data[0].Key,
        });
      });
    }

    if (this.companyLogo != null) {
      await this.uploadDocuments(this.companyLogo).then((res: any) => {
        this.createProfile.patchValue({
          company_logo: res.data[0].Key,
        });
      });
    }
    let data = this.createProfile.value;
    let reqData = {
      ...this.createProfile.value,
      id: this.adminId,
      country_code:this.selectedCountryCode,
      language:this.selectedLanguages,
      mobile_pay_details: data?.mobilePayDetails,
    };
    console.log("reqDatareqDatareqData",reqData);
    
// return
    this._insuranceService.updateCreateProfile(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status == true) {
        this.loader.stop();
        this._coreService.showSuccess(response.message, "");
        this.route.navigate(["/insurance/login"]);
      }else{
        this.loader.stop();
        this._coreService.showError(response.message, "");
      }
      // if (response.status) {
      //   this._coreService.showSuccess(response.message, "");

      //   this._insuranceService.login(this.loginCreds).subscribe((res) => {
      //     let result = this._coreService.decryptObjectData(res);

      //     if (result.status) {
      //       if (result.errorCode === "PROFILE_NOT_APPROVED") {
      //         this._coreService.showError(result.errorCode, "");
      //         this.route.navigate(["/insurance/login"]);
      //         return;
      //       } else {
      //         this._coreService.setLocalStorage(
      //           result.body?.user_details?.adminData,
      //           "adminData"
      //         );
      //         this._coreService.setLocalStorage(
      //           result.body?.user_details?.portalUserData,
      //           "loginData"
      //         );
      //         this._coreService.setProfileDetails(
      //           result.body?.user_details?.adminData?.company_name
      //         );
      //         this.auth.setToken(result.body.token);
      //         this.auth.setRole("insurance");
      //         this.auth.setRefreshToken(result.body.refreshToken);
      //         this.route.navigate(["/insurance/policyclaim"]);
      //         this._coreService.showSuccess(result.message, "");
      //       }
      //     }
      //   });
      // }
    });
  }

  toggleInputBlock(event: any) {
    this.showOtherInput = (event.value === 'Others');
    if (!this.showOtherInput) {
      this.createProfile.patchValue({ other_company_type_name: '' });
    }
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  ngOnDestroy(): void {
    if (this.insSub) {
      this.insSub.unsubscribe();
    }
  }

  //-----Calling address API's---------------
  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // this.spokenLanguages = response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;
      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });  
      this.createProfile.patchValue({
        language: this.selectedLanguages
     });
    });
  }

  getCountryList() {
    this.countryList=[]
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const countryList = result.body?.list;
        countryList.map((country)=>{
           this.countryList.push(
            {
              label : country.name,
              value : country._id
            }
           )
           
        })
      
        let data =   this.countryList.map((ele)=>{
          // console.log("naaaaaaaaaaaaaa", ele.name);
          if(ele.name === "Burkina Faso"){
            this.patchCountry = ele._id;
            // console.log("this.patchCountry",this.patchCountry);            
          }
          
        })
        if(this.patchCountry!='')
        {
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
    if(!countryID){
      return;
    }
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const regionList = result.body?.list;
        regionList.map((region)=>{
           this.regionList.push({
            label : region.name,
            value  : region._id
           })
        })
        this.createProfile.get("region").patchValue(this.locations.region)
        if(!this.createProfile.get("region").value){
          this.createProfile.get("department").patchValue("")
          this.createProfile.get("city").patchValue("")
          this.createProfile.get("village").patchValue("")
          this.createProfile.get("province").patchValue("")
          }
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
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const provienceList = result.body?.list;
        provienceList.map((province)=>{
          this.provienceList.push(
            {
              label : province.name,
              value : province._id
            }
          )
        })
        this.createProfile.get("province").patchValue(this.locations.province) 
        if(!this.createProfile.get("province").value){
          this.createProfile.get("department").patchValue("")
          this.createProfile.get("city").patchValue("")
          this.createProfile.get("village").patchValue("")
          }
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
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const departmentList = result.body?.list;
        departmentList.map((department)=>{
          this.departmentList.push({
            label : department.name,
            value  : department._id
          })
        })
        this.createProfile.get("department").patchValue(this.locations.department) 
        if(!this.createProfile.get("department").value){
          this.createProfile.get("city").patchValue("")
          this.createProfile.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.villageList = []
    this.cityList = []
    if(!departmentID){
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const cityList = result.body.list;
        cityList.map((city)=>{
          this.cityList.push({
            label : city.name,
            value :city._id
          })
        })
        this.createProfile.get("city").patchValue(this.locations.city) 
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const villageList = result.body.list;
        villageList.map((village)=>{
          this.villageList.push(
            {
              label : village.name,
              value : village._id
            }
          )
        })
        this.createProfile.get("village").patchValue(this.locations.village) 
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get f() {
    return this.createProfile.controls;
  }

  onFileChange(event: any, fileFor: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      const formData: FormData = new FormData();

      formData.append(
        "userId",
        this.userId as string
      );
      formData.append("docType", fileFor);
      formData.append("multiple", "false");
      formData.append("docName", file);

      if (fileFor === "pfofile") {
        this.profileImage = formData;
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.groupIcon = event.target.result;
        };

        reader.readAsDataURL(event.target.files[0]);
      } else {
        this.companyLogo = formData;
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.logoIcon = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

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

  //-------------------Form Array Handling--------------
  get fax() {
    return this.createProfile.controls["fax"] as FormArray;
  }
  get phones() {
    return this.createProfile.controls["office_phone"] as FormArray;
  }

  addFax() {
    this.faxForm = this.fb.group({
      fax_number: [""],
    });
    this.fax.push(this.faxForm);
  }

  addPhone() {
    this.officePhoneForm = this.fb.group({
      office_phone_number: [""],
    });

    this.phones.push(this.officePhoneForm);
  }

  deleteFax(index: number) {
    this.fax.removeAt(index);
  }

  deletePhone(index: number) {
    this.phones.removeAt(index);
  }

  handleRemoveLogo(data: any) {
    if( data == "profilepic"){
      console.log("Profile logo")
      this.groupIcon=""
      this.createProfile.get("profile_pic").reset();
    }
    if( data == "companylogo"){
      console.log("Remove Company logo")
      this.logoIcon = "";
      this.createProfile.get("company_logo").reset();
    }
  }


  onSelectionChange(event: any): void {
    this.selectedLanguages = this.createProfile.value.language;
  }
}
