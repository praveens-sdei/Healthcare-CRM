import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { PatientService } from "../patient.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { InsuranceSubscriber } from "../../insurance/insurance-subscriber.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/shared/auth.service";
import { SuperAdminService } from "../../super-admin/super-admin.service";
import { Moment } from "moment";
import * as moment from "moment";
import intlTelInput from "intl-tel-input";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-patient-createprofile",
  templateUrl: "./patient-createprofile.component.html",
  styleUrls: ["./patient-createprofile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PatientCreateprofileComponent implements OnInit {
  patient_id: any = "";
  personalDetails!: FormGroup;
  isSubmitted: any = false;
  showAddressComponent: any = false;

  genderList: any[] = [];
  bloodGroupList: any[] = [];
  martialStatusList: any[] = [];
  spokenLanguageList: any[] = [];
  relationshipList: any[] = [];

  profileImage: any = "";
  profilePicFile: any = null;
  patientName = "";
  dob:any=new Date()
  loginCreds: any;
  deviceId: any = "";

  maxDOB: any;

  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  defaultCountry: any = "";
  iti: any;
  selectedCountryCode: any = "+226";
  selectedcountrycodedb: any = '';
  countryCodes: string[];
  @ViewChild("mobile") mobile: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  patchCountry: any;

  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    breakpointObserver: BreakpointObserver,
    private route: Router,
    private datePipe: DatePipe,
    private insuranceSubscriber: InsuranceSubscriber,
    private modalService: NgbModal,
    private auth: AuthService,
    private sadminService: SuperAdminService,
    private loader: NgxUiLoaderService
  ) {
    this.personalDetails = this.fb.group({
      profile_pic: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      dob: ["",[Validators.required]],
      age: [0],
      spokenLanguage: [""],
      email: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      blood_group: [""],
      marital_status: [""],

      address: [""],
      loc: [""],
      neighborhood: [""],
      country: [""],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      village: [""],
      pincode: [""],

      emergency_contact: this.fb.group({
        name: [""],
        relationship: [""],
        phone_number: [
          "",
          /* [Validators.pattern(/^-?(0|[1-9]\d*)?$/)] */,
        ],

      }),
      mobilePayDetails: this.fb.array([])
    });

    this.countryCodes =  ["+226(BF)","+229(BJ)", "+225(CI)", "+223(ML)", "+221(SN)", "+228(TG)"];
  }
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    // console.log("this.selectedCountryCode",getCode);

    this.selectedCountryCode = "+" + getCode;
    // console.log("this.selectedCountryCode",this.selectedCountryCode);
  };
  ngOnInit(): void {
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    this.maxDOB = d;

    let loginData = JSON.parse(sessionStorage.getItem("loginData"));
    let adminData = JSON.parse(sessionStorage.getItem("adminData"));
    // console.log("adminData-->",adminData.dob);

    this.loginCreds = JSON.parse(sessionStorage.getItem("loginCreds"));

    this.patient_id = loginData?._id;
    let fullName: any = [];
    if (adminData?.full_name) {
      fullName = adminData?.full_name.split(" ");
    }
    // const dob = adminData?.dob ? moment(adminData.dob).format('MM/DD/YYYY') : '';
    // this.addMobPay();
    this.personalDetails.patchValue({
      first_name: fullName[0] ? fullName[0] : "",
      middle_name: fullName[1] ? fullName[1] : "",
      last_name: fullName[2] ? fullName[2] : "",
      email: loginData?.email,
      mobile: loginData?.mobile,
      gender: adminData?.gender,
      blood_group: adminData?.blood_group,
      dob:adminData?.dob,
      // dob: new Date(dob),
      marital_status: adminData?.marital_status,
      country_code:this.selectedcountrycodedb
    });
    console.log("patchvalue===> ",this.personalDetails.value)
    this.getCommonData();
    this.getPersonalDetails();
    // this.showAddressComponent = true;
    this.getCountryList();
    this.getCityList("");
    this.getRegionList("");
    this.getDepartmentList("");
    this.getProvienceList("");
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

  getCountryCode() {
    var country_code = '';

    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (countryData[i].dialCode === this.selectedcountrycodedb.split("+")[1]) {
        country_code = countryData[i].iso2;
        break; // Break the loop when the country code is found
      }
    }
    const input = this.mobile.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: country_code,
      separateDialCode: true,
    });
    console.log("this.iti", this.iti);
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
    console.log("this.selectedCountryCode", this.selectedCountryCode);
  }

  ngAfterViewInit() {
    // var country_code = '';

    // const countryData = (window as any).intlTelInputGlobals.getCountryData();
    // for (let i = 0; i < countryData.length; i++) {
    //   if (countryData[i].dialCode === this.selectedcountrycodedb.split("+")[1]) {
    //     country_code = countryData[i].iso2;
    //     break; // Break the loop when the country code is found
    //   }
    // }
    // const input = this.mobile.nativeElement;
    // this.iti = intlTelInput(input, {
    //   initialCountry: country_code,
    //   separateDialCode: true,
    // });
    // console.log("this.iti", this.iti);
    // this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
    // console.log("this.selectedCountryCode", this.selectedCountryCode);
    // const input = this.mobile.nativeElement;
    // this.iti = intlTelInput(input, {
    //   initialCountry: "fr",
    //   separateDialCode: true,
    // });
    // console.log(" this.iti", this.iti);

    // this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
    // console.log(" this.selectedCountryCode", this.selectedCountryCode);
    

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
      this.personalDetails.patchValue({ loc: this.loc });
      this.personalDetails.patchValue({ address: place.formatted_address });
    });
  }

  getPersonalDetails() {
    let params = {
      patient_id: this.patient_id,
    };
    this.service.viewPaientPersonalDetails(params).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("GET ALL PERSONAL DETAILS================>", response);
      let info = response?.body?.personalDetails;
      this.patientName =
        info?.first_name + " " + info?.middle_name + " " + info?.last_name;
      this.pathcPersonalDetails({
        profile: response.body?.personalDetails,
        in_location: response.body?.locationinfos,
        in_mobile_pay:response?.body?.mobilePayDetails
      });
      this.selectedcountrycodedb = response?.body?.portalUserDetails?.country_code
      this.getCountryCode();
    });
  }

  mobilePayValidation(index) {
    let abc = this.personalDetails.get("mobilePayDetails") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get mobilePayDetails() {
    return this.personalDetails.controls["mobilePayDetails"] as FormArray;
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

  //-----------------Patch Value Section----------------------------------
  pathcPersonalDetails(data: any) {
    console.log("patch",data);
    if (data?.in_mobile_pay) {
      data?.in_mobile_pay?.mobilePay.forEach((element) => {
        this.addMobPay();
      });
    } else {
      this.addMobPay();
    }
    let patientAge = this.calculateAge(data?.profile?.dob);
    this.personalDetails.patchValue({
      ...data?.profile,
      ...data?.profile?.for_portal_user,
      ...data?.in_location,
      age: patientAge,
      mobilePayDetails: data?.in_mobile_pay?.mobilePay,
    });
    this.profileImage = data?.profile?.profile_pic_signed_url;
    console.log(" this.profileImage", this.profileImage);
    
    this.showAddressComponent = true;
  }

  async handlePersonalDetails() {
    this.isSubmitted = true;
    console.log("this.personalDetails.invalid",this.personalDetails.value);

    if (this.personalDetails.invalid) {
      console.log("====================INVALID=========================");
      this.toastr.error("All Fields are required.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    if (this.profilePicFile != null) {
      await this.uploadDocuments(this.profilePicFile).then((res: any) => {
        this.personalDetails.patchValue({
          profile_pic: res.data[0].Key,
        });
      });
    }
    let data = this.personalDetails.value;
    let reqData = {
      ...this.personalDetails.value,
      patient_id: this.patient_id,
      country_code: this.selectedCountryCode,
      mobile_pay_details: data?.mobilePayDetails,
    };

    this.service.personalDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);

        this.service.login(this.loginCreds, this.deviceId).subscribe({
          next: (res) => {
            let encryptedData = { data: res };
            let response = this._coreService.decryptObjectData(encryptedData);
            if (response.body.otp_verified === true) {
              this._coreService.setLocalStorage(
                response.body?.user_details?.profileData,
                "profileData"
              );
              this._coreService.setLocalStorage(
                response.body?.user_details?.portalUserData,
                "loginData"
              );
              this.auth.setToken(response.body.token);
              this.auth.setRole("patient");
              this.auth.setRefreshToken(response.body.refreshToken);
              this._coreService.showSuccess(response.message, "");
              this.route.navigate(["/patient/dashboard"]);
            }
          },
        });
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  skip(){
    this.route.navigate(["/patient/subscriptionplan"]);
  }
  //For Patient Profile
  async onProfilePicChange(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let formData: any = new FormData();
      formData.append("userId", this.patient_id);
      formData.append("docType", "profile_pic");
      formData.append("multiple", "false");
      formData.append("docName", file);

      this.profilePicFile = formData;

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileImage = event.target.result;
        console.log("this.profileImage",this.profileImage)
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this.service.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData(res);
          resolve(response);
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.messgae);
        }
      );
    });
  }

  getCommonData() {
    this.service.commonData().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.genderList = response?.body?.gender;
      this.bloodGroupList = response?.body?.bloodGroup;
      this.martialStatusList = response?.body?.martialStatus;
      this.spokenLanguageList = response?.body?.spokenLanguage;
      this.relationshipList = response?.body?.relationship;
    });
  }

  handleDOBChange(event: any, dob_for: any) {
    let patientAge = this.calculateAge(event.value);

    if (dob_for === "personalDetails") {
      this.personalDetails.patchValue({
        age: patientAge,
      });
    }
  }

  calculateAge(dob: any) {
    let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    let patientAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return patientAge;
  }

  get f() {
    return this.personalDetails.controls;
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //-----Calling address API's---------------
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];

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
              label : country.name,
              value : country._id
            }
          )
        })
        let data =   this.countryList.map((ele)=>{
          console.log("naaaaaaaaaaaaaa", ele.name);
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
    if(!countryID){
      return;
    }
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const regionList = result.body?.list;
        regionList.map((region)=>{
          this.regionList.push(
            {
              label : region.name,
              value : region._id
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(!provinceID ){
      return;
    }
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const departmentList = result.body?.list;
        departmentList.map((department)=>{
          this.departmentList.push(
            {
              label : department.name,
              value : department._id
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
    this.villageList = []
    if(!departmentID){
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const cityList = result.body.list;
        cityList.map((city)=>{
        this.cityList.push(
          {
            label : city.name,
            value : city._id
          }
        )
      })
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
