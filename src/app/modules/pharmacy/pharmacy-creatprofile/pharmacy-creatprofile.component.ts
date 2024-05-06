import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../pharmacy.service";
import {
  IProfileRequest,
  IProfileResponse,
} from "./pharmacy-creatprofile.type";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { map, Observable, startWith } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import intlTelInput from "intl-tel-input";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: "app-pharmacy-creatprofile",
  templateUrl: "./pharmacy-creatprofile.component.html",
  styleUrls: ["./pharmacy-creatprofile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PharmacyCreatprofileComponent implements OnInit {
  portalUserId: any;
  pharEmail: any;
  pharMobile: any;
  pharName: any;
  pharmacy_name: any = "";
  profileImage: any = "";
  pharmacyPictures: any[] = [];
  showAddressComponent: any = false;
  myControl = new FormControl("");
  filteredOptions!: Observable<any[]>;
  @ViewChild("mobile") mobile: ElementRef<HTMLInputElement>;
  isSubmitted: any = false;
  profileData: any = "";
  license_picture: any;
  docArray: any[] = [];
  selectedcountrycodedb: any = '';
  iti: any;
  selectedCountryCode: string;
  pageSize: number = 0;
  totalLength: number = 0;
  page: any = 1;
  public searchText = "";
  dutyGroupList: any = [];
  pharmacySource: any = [];
  dutyControl = new FormControl("");
  // dutyfilteredOptions!: Observable<any[]>;
  dutyfilteredOptions: any=[];
  overlay : false;
  onDutyGroupNo: any;
  onDutyCity: any;
  onDutyValue: any;
  selectedonduty:any='';
  profile_picture: string;
  countryCodes: string[];
  isSubmited : false 
  constructor(
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private sanitizer: DomSanitizer,
    private sadminService: SuperAdminService,
    private pharmacy: PharmacyService,
    private route: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private loader: NgxUiLoaderService
  ) {
    // let storageData = this.coreService.getSessionStorage("portalData");
    // this.pharEmail = storageData.email;
    // this.pharMobile = storageData.phone_number;
    // this.pharName = storageData.user_name;
    // this.portalUserId = storageData._id;

    this.countryCodes =  ["+226(BF)","+229(BJ)", "+225(CI)", "+223(ML)", "+221(SN)", "+228(TG)"];
  }
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
  getCountryCode() {
    var country_code = '';
    console.log("PATCH DATA====>1", this.selectedcountrycodedb);
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
    this.selectedcountrycodedb = "+" + this.iti.getSelectedCountryData().dialCode;
  }

  ngOnInit(): void {
    // this.profileFields.controls["email"].patchValue(this.pharEmail);
    // this.profileFields.controls["pharmacy_name"].patchValue(this.pharName);
    // this.profileFields.controls["main_phone_number"].patchValue(
    //   this.pharMobile
    // );
    // this.profileFields.controls["mobile_phone_number"].patchValue(
    //   this.pharMobile
    // );

    let loginData = JSON.parse(sessionStorage.getItem("loginData"));
    console.log("loginData", loginData);

    let adminData = JSON.parse(sessionStorage.getItem("adminData"));

    this.portalUserId = loginData?._id;

    this.getAllAssociationGroup();
  
  }

  // profilePicture: any;

  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      console.log(file);
      // this.profilePicture = file;
      // this.profileFields.patchValue({
      //   profile_picture: file,
      // });
      console.log(this.profileFields.value);
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public locationFields: FormGroup = new FormGroup({
    nationality: new FormControl("", [Validators.required]),
    neighborhood: new FormControl(""),
    region: new FormControl(""),
    province: new FormControl(""),
    department: new FormControl(""),
    city: new FormControl(""),
    village: new FormControl("", []),
    pincode: new FormControl(""),
  });

  public bankDataFields: FormGroup = new FormGroup({
    bank_name: new FormControl(""),
    account_holder_name: new FormControl(""),
    account_number: new FormControl(""),
    ifsc_code: new FormControl(""),
    bank_address: new FormControl(""),
  });

  public mobilePayFields: FormGroup = new FormGroup({
    provider: new FormControl(""),
    pay_number: new FormControl(""),
  });

  public profileFields: FormGroup = new FormGroup(
    {
      // {value: 'Nancy', disabled: true}
      lisencePic: new FormControl(""),
      profileImage: new FormControl(""),
      address: new FormControl("", [Validators.required]),
      loc: new FormControl(""),
      email: new FormControl("", [Validators.required]),
      first_name: new FormControl("",[Validators.required]),
      middle_name: new FormControl(""),
      last_name: new FormControl("",[Validators.required]),
      pharmacy_name: new FormControl("", [Validators.required]),
      slogan: new FormControl(""),
      main_phone_number: new FormControl("", [Validators.required]),
      additional_phone_number: new FormArray([new FormControl("", [])], []),
      about_pharmacy: new FormControl(""),
      medicine_request: new FormGroup({
        prescription_order: new FormControl(false),
        medicine_price_request: new FormControl(false),
        request_medicine_available: new FormControl(false),
      }),
      association: new FormGroup({
        enabled: new FormControl(true),
        name: new FormArray([]),
      }),
      name: new FormArray([new FormControl("", [])], []),

      profile_picture: new FormControl("", []),
      licence_details: new FormGroup({
        id_number: new FormControl("", [Validators.required]),
        expiry_date: new FormControl("", [Validators.required]),
        licence_picture: new FormControl(""),
      }),
      duty_group: new FormGroup({
        enabled: new FormControl(true, []),
        id_number: new FormControl("", []),
      }),
      show_to_patient: new FormControl(false),
      bank_details: this.bankDataFields,
      // mobile_pay_details: this.mobilePayFields,
      location_info: this.locationFields,
      mobilePayDetails: this.fb.array([])
    },
    { validators: [] }
  );

  additional_phone_number = this.profileFields.get(
    "additional_phone_number"
  ) as FormArray;

  name = this.profileFields.get("name") as FormArray;

  licence_doc: FormData = null;
  pharmacypictures: FormData = null;
  profilePicture: FormData = null;
  pharmacyPicUrl: SafeResourceUrl[] = [];
  lisencePic: any = false;

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  onFileSelected(
    event: any,
    type: "licence" | "pharmacypictures" | "profilepicture"
  ) {
    const files: File[] = event.target.files;
    name;
    const formData: FormData = new FormData();

    formData.append(
      "userId",
      sessionStorage.getItem("portal-user-id") as string
    );
    formData.append("docType", type);

    if (type === "pharmacypictures") {
      formData.append("multiple", "true");
      // this.pharmacyPicUrl = [];
    } else {
      formData.append("multiple", "false");
    }
    if (files.length === 1) {
      formData.append("multiple", "false");
    }

    for (const file of files) {
      formData.append("docName", file);
      if (type === "pharmacypictures") {
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.pharmacyPicUrl.push(imgUrl);
      }
    }

    if (type === "licence") {
      this.licence_doc = formData;

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.lisencePic = event.target.result;
      console.log("licence", this.lisencePic);

      };
      reader.readAsDataURL(event.target.files[0]);
      console.log("licence", event);

      // console.log("licence",event)
    }
    if (type === "pharmacypictures") {
      this.pharmacypictures = formData;
    }
    if (type === "profilepicture") {
      this.profilePicture = formData;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileImage = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private getProfileField(...field: string[]) {
    return this.profileFields.get(field).value;
  }

  private getLocationField(field: string) {
    return this.locationFields.get(field).value;
  }

  private getBankdataField(field: string) {
    return this.bankDataFields.get(field).value;
  }

  private getMobilePayField(field: string) {
    return this.mobilePayFields.get(field).value;
  }

  addAdditionalPhone() {
    (this.profileFields.get("additional_phone_number") as FormArray).push(
      new FormControl("")
    );
  }

  removeAdditionalPhone(index: number) {
    (this.profileFields.get("additional_phone_number") as FormArray).removeAt(
      index
    );
  }

  addAdditionalName() {
    (this.profileFields.get("name") as FormArray).push(new FormControl(""));
  }

  removeAdditionalName(index: number) {
    (this.profileFields.get("name") as FormArray).removeAt(index);

    this.arrayForAssociationGroupID.splice(index, 1);
    console.log("ID Removed------>", this.arrayForAssociationGroupID);
  }

  private uploadDocument(doc: FormData) {
    return new Promise((resolve, reject) => {
      this.pharmacyService.uploadDocument(doc).subscribe({
        next: (result: IResponse<any>) => {
          let response = this.coreService.decryptObjectData({ data: result });
          resolve(response);
          reject(response);
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
          // if (err.message === "INTERNAL_SERVER_ERROR") {
          //   this.coreService.showError("", err.message);
          // }
        },
      });
    });
  }

  mobilePayValidation(index) {
    let abc = this.profileFields.get("mobilePayDetails") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get mobilePayDetails() {
    return this.profileFields.controls["mobilePayDetails"] as FormArray;
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
  
  public async createProfile(): Promise<void> {
    this.isSubmitted = true;
    const isInvalid =
      this.profileFields.invalid ||
      this.locationFields.invalid ||
      this.bankDataFields.invalid ||
      this.mobilePayFields.invalid;


    if (isInvalid) {
      console.log("Invalid fields");
      this.profileFields.markAllAsTouched();
      this.locationFields.markAllAsTouched();
      this.bankDataFields.markAllAsTouched();
      this.mobilePayFields.markAllAsTouched();


      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid'
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this.coreService.showError("","Please fill all required fields." )
      return;
    }

    const invalid = [];
    const controls = this.profileFields.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log("PROFILE==>", invalid);

    const invalid2 = [];
    const controls2 = this.locationFields.controls;
    for (const name in controls2) {
      if (controls2[name].invalid) {
        invalid2.push(name);
      }
    }
    console.log("PROFILE2==>", invalid2);

    const invalid3 = [];
    const controls3 = this.bankDataFields.controls;
    for (const name in controls3) {
      if (controls3[name].invalid) {
        invalid3.push(name);
      }
    }
    console.log("PROFILE3==>", invalid3);

    const invalid4 = [];
    const controls4 = this.mobilePayFields.controls;
    for (const name in controls4) {
      if (controls4[name].invalid) {
        invalid4.push(name);
      }
    }
    console.log("PROFILE4==>", invalid4);
    this.loader.start();
    if (this.licence_doc) {
      await this.uploadDocument(this.licence_doc).then((res: any) => {
        this.license_picture = res.data[0].Key;
        this.profileFields.patchValue({
          license_details: {
            licence_picture: res.data[0].Key,
          },
        });
      });
    }

    if (this.pharmacypictures) {
      await this.uploadDocument(this.pharmacypictures).then((res: any) => {
        for (let doc of res.data) {
          this.docArray.push(doc.Key);
        }
      });
    }

    if (this.profilePicture) {
      await this.uploadDocument(this.profilePicture).then((res: any) => {
        this.profileFields.patchValue({
          profile_picture: res.data[0].key,
        });
      });
    }
    let data = this.profileFields.value;

    const profileRequest: IProfileRequest = {
      for_portal_user: sessionStorage.getItem("portal-user-id") as string,
      address: this.getProfileField("address"),
      email:this.getProfileField("email"),
      loc: this.getProfileField("loc"),
      first_name: this.getProfileField("first_name"),
      middle_name: this.getProfileField("middle_name"),
      last_name: this.getProfileField("last_name"),
      pharmacy_name: this.getProfileField("pharmacy_name"),
      slogan: this.getProfileField("slogan"),
      main_phone_number: this.getProfileField("main_phone_number"),
      additional_phone_number: this.getProfileField("additional_phone_number"),
      about_pharmacy: this.getProfileField("about_pharmacy"),
      medicine_request: {
        prescription_order: this.getProfileField(
          "medicine_request",
          "prescription_order"
        ),
        medicine_price_request: this.getProfileField(
          "medicine_request",
          "medicine_price_request"
        ),
        request_medicine_available: this.getProfileField(
          "medicine_request",
          "request_medicine_available"
        ),
      },
      association: {
        enabled: this.getProfileField("association", "enabled"),
        // name: this.getProfileField("association", "name"),
        // name: this.getProfileField("name"),
        name: this.arrayForAssociationGroupID,
      },
      profile_picture: this.getProfileField("profile_picture"),
      // profile_picture:this.profile_picture,
      licence_details: {
        licence_picture: this.license_picture,
        // license_picture:this.getProfileField("licence_details", "license_picture"),
        id_number: this.getProfileField("licence_details", "id_number"),
        expiry_date:
          this.getProfileField("licence_details", "expiry_date")
      },
      duty_group: {
        enabled: this.getProfileField("duty_group", "enabled"),
        // id_number: this.getProfileField("duty_group", "id_number"),
        id_number:this.arrayForOnDutyID,
      },
      show_to_patient: this.getProfileField("show_to_patient"),
      bank_details: {
        bank_name: this.getBankdataField("bank_name"),
        account_holder_name: this.getBankdataField("account_holder_name"),
        account_number: this.getBankdataField("account_number"),
        ifsc_code: this.getBankdataField("ifsc_code"),
        bank_address: this.getBankdataField("bank_address"),
      },
      // mobile_pay_details: {
      //   provider: this.getMobilePayField("provider"),
      //   pay_number: this.getMobilePayField("pay_number"),
      // },
      mobile_pay_details:data?.mobilePayDetails,
      location_info: {
        nationality: this.getLocationField("nationality"),
        neighborhood: this.getLocationField("neighborhood"),
        region: this.getLocationField("region"),
        province: this.getLocationField("province"),
        department: this.getLocationField("department"),
        city: this.getLocationField("city"),
        village: this.getLocationField("village"),
        pincode: this.getLocationField("pincode"),
      },
      pharmacy_picture: this.docArray,
    };

    console.log("profileRequest==>", profileRequest);

    this.pharmacyService.createProfile1(profileRequest).subscribe({
      next: (result: IResponse<IProfileResponse>) => {      
        let response = this.coreService.decryptObjectData({ data: result });
        console.log(response);
        if (response.status == true) {
          this.loader.stop();
          this.coreService.showSuccess("", response.message);          
          this.route.navigate(["/pharmacy/login"]);
        }else{
          this.loader.stop();
          this.coreService.showError("", response.message);          
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();
        this.coreService.showError("Error", err.message);

        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  getProfile() {
    return new Promise(async (resolve,reject)=>{
    this.pharmacyService.viewProfileById(this.portalUserId).subscribe({
      next: (result: IResponse<IProfileResponse>) => {
        let response = this.coreService.decryptObjectData({ data: result });
        console.log("PROFILE DETAILS===>", response);
        this.pharmacy_name = response.data.adminData.pharmacy_name;
        this.profileImage =
          response?.data?.adminData?.profile_picture_signed_url;

        this.lisencePic = response?.data?.licencePicSignedUrl;
      console.log("licence", this.lisencePic);
        
        this.license_picture = response?.data?.adminData?.licence_details?.licence_picture
        this.profile_picture = response?.data?.adminData?.profile_picture;
       this.selectedonduty=response?.data?.adminData?.duty_group?.id_number;
        response?.data?.adminData?.pharmacy_picture_signed_urls.forEach(
          (element) => {
            this.pharmacyPicUrl.push(element);
          }
        );

        response?.data?.adminData?.pharmacy_picture.forEach((element) => {
          //already added pictures
          this.docArray.push(element);
        });

        this.profileData = {
          name: response?.data?.adminData?.pharmacy_name,
          profile: response?.data?.adminData?.profile_picture_signed_url,
        };

        console.log("Send to header===>", this.profileData);

        if (response.data?.mobilePayData) {
          response.data?.mobilePayData?.mobilePay.forEach((element) => {
            this.addMobPay();
          });
        } else {
          this.addMobPay();
        }

        this.profileFields.patchValue({
          ...response.data.adminData,
          ...response.data.portalUserData,
          main_phone_number: response.data.portalUserData?.phone_number,
          bank_details: { ...response.data.bankDetails },
          mobilePayDetails: response.data?.mobilePayData?.mobilePay,
          // mobile_pay_details: { ...response.data.mobilePayData },
          loc: { ...response?.data?.adminData?.in_location?.loc },
          association:{enabled:response?.data?.adminData?.association?.enabled},
          duty_group:{enabled:response?.data?.adminData?.duty_group?.enabled},
          
        });
        if (response?.data?.adminData?.association?.name && response?.data?.adminData?.association?.name.length > 0) {
          // Clear existing form controls
          const nameFormArray = this.profileFields.get('name') as FormArray;
          while (nameFormArray.length) {
            nameFormArray.removeAt(nameFormArray.length - 1);
          }
    
          // Add form controls based on the length of userDetails.association.name
          response?.data?.adminData?.association?.name.forEach(value => {
            nameFormArray.push(this.fb.control(value));
          });
        }

        this.locationFields.patchValue({
          ...response.data?.locationData,
        });
        this.selectedcountrycodedb = response?.data?.portalUserData?.country_code
        this.getCountryCode();

        console.log("AFTER PATCH====>", this.profileFields.value);

        if (response.data.adminData?.additional_phone_number && response.data.adminData?.additional_phone_number.length > 0) {
          // Clear existing form controls
          const nameFormArray = this.profileFields.get('additional_phone_number') as FormArray;
          while (nameFormArray.length) {
            nameFormArray.removeAt(0);
          }
          // Add form controls based on the length of additional_phone_number
          response.data.adminData?.additional_phone_number.forEach(value => {
            nameFormArray.push(this.fb.control(value));
          });
        }
        this.showAddressComponent = true;
        this.selectedcountrycodedb = response?.data?.portalUserData?.country_code
        resolve(true)
      },
      error: (err: ErrorEvent) => {
        reject(true);
        this.coreService.showError("Error", err.message);
      },
    });
  })
  }

  handleSelectChange(event: any) {
    if (event.value === false) {
      this.profileFields.value.name.splice(0);
    }
  }

  associationList: any[] = [];

  getAllAssociationGroup() {
    this.pharmacy.associationList().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      for (let association of response?.data) {
        let obj = {
          value: association._id,
          label: association.group_name,
        };
        this.associationList.push(obj);
      }
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );
      this.onDutyGroupList();
      // console.log("Association List", this.associationList);
    });
  }

  //----Auto-Complete Code----------

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log("----->", this.associationList);
    if (this.associationList.length > 0) {
      var result = this.associationList.filter((option: any) => {
        return option.name.toLowerCase().includes(filterValue);
      });
      return result.length > 0 ? result : ["No Data"];
    }
    return ["No Data"];
  }

  arrayForAssociationGroupID: any[] = [];

  updateMySelection(data: any, index: number) {
    this.arrayForAssociationGroupID[index] = data?.value;
  }

  pharmacyPics: any[] = [];

  readDocument(url: any) {
    let reqData = {
      url: url,
    };
    // this.pharmacyService.signedUrl(reqData).subscribe((res)=>{
    //   let response = this.coreService.decryptObjectData({data:res})
    //   console.log("Doc Read---->",response)
    //   this.profileImage = response?.data

    // })
  }

  removeSelectpic(data: any, index: any = "") {
    if ((data === "profileImage")) {
      console.log("this.profilePicture",this.profile_picture)
      this.profileImage = "";
      // this.profilePicture ="";
      this.profile_picture="";
      console.log("this.After",this.profile_picture);
      // this.profileFields.get("profileImage").reset();
    }
    if ((data === "lisencePic")) {
      this.lisencePic = false;
      this.license_picture = "";
      // this.profileFields.get("licence_picture").reset();
    }
    if ((data === "pharmacy_pic")) {
      this.pharmacyPicUrl.splice(index, 1);
      this.docArray.splice(index, 1);
    }
  }
  ondutyGroupList:any=[];
  public onDutyGroupList() {
    const listRequest = {
      page: this.page,
      limit: this.pageSize,
      searchKey: this.searchText,
    };
    this.sadminService.listDutyGroup(listRequest).subscribe({
      next: (res) => {
        let groupList: any = [];
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
        this.pharmacySource = result?.data;
        this.totalLength = result?.data?.totalCount; 
        this.ondutyGroupList = result?.data?.data.map((onDuty) => ({
          value: onDuty._id,
          label: onDuty.city +"-"+ onDuty.onDutyGroupNumber,
          onDutyGroupNumber: onDuty.onDutyGroupNumber,
        }));
        this.getProfile();
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
      },
    });
  }

  arrayForOnDutyID: any = [];

  updateMyDutySelection(data: any) {
    this.arrayForOnDutyID = data?.value;
  }

  displayFn(option: any): string {
    if (option && option.city && option.onDutyGroupNumber) {
      return `${option.city} - ${option.onDutyGroupNumber}`;
    }
    return '';
  }
  
}
