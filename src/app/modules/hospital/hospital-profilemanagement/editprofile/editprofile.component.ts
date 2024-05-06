import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { log } from "console";
import { map, Observable, startWith } from "rxjs";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import intlTelInput from "intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { HospitalService } from "../../hospital.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditprofileComponent implements OnInit {

  showAddressComponent: any = false;
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  profileImage: any = "";
  portalUserId: any;
  pharEmail: any;
  pharMobile: any;
  pharName: any;

  licence_doc: FormData = null;
  pharmacypictures: FormData = null;
  profilePicture: FormData = null;
  pharmacyPicUrl: SafeResourceUrl[] = [];
  arrayForAssociationGroupID: any[] = [];
  associationList: any[] = [];
  license_picture: any = null;
  docArray: any[] = [];
  phoneArray: any[] = [];
  loc: any = {};
  iti: any;
  selectedCountryCode: any;
  overlay: false;

  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  healthCenterTypes: any[] = [];
  imagePreview: any;
  profile_picture: any = "";
  selectedCountryCodedb: any = '';
  healthCenter: any;
  adminDetails: any;
  selectedFiles: any = '';
  isSubmitted: boolean = false;

  displayedColumns1: string[] = ['healthPlan', 'fromDate', 'toDate'];
  allTestsList: any = [];
  deleteTestData: any = {};
  isColumnNameCorrect: boolean = false;
  countryCodes: string[];
  manualForm: FormGroup;
  editmanualForm: FormGroup;
  testIdForUpdate: any;
  allTestsListData : any = [];

  constructor(
    private fb: FormBuilder,
    private _coreService: CoreService,
    private sanitizer: DomSanitizer,
    private superAdmin: SuperAdminService,
    private _hospitalService: HospitalService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService
  ) {
    let storageData = this._coreService.getSessionStorage("portalData");

    this.pharEmail = storageData?.email;
    let loginData = JSON.parse(localStorage.getItem('loginData'));
    this.portalUserId = loginData?._id;
    console.log("LOGIN DATA===>", this.portalUserId)

    this.countryCodes = ["+226(BF)", "+229(BJ)", "+225(CI)", "+223(ML)", "+221(SN)", "+228(TG)"];

    this.manualForm = this.fb.group({
      manualentries: this.fb.array([]),
    });

    this.editmanualForm = this.fb.group({
      typeOfTest: ["", [Validators.required]],
      nameOfTest: ["", [Validators.required]]
    });
  }

  public bankDataFields: FormGroup = new FormGroup({
    bank_name: new FormControl(""),
    account_holder_name: new FormControl(""),
    account_number: new FormControl(""),
    ifsc_code: new FormControl(""),
    bank_address: new FormControl(""),
  });

  public ifUDataFields: FormGroup = new FormGroup({
    ifuNumber: new FormControl("", [Validators.required]),
    rccmNumber: new FormControl("", [Validators.required]),
  });

  public locationFields: FormGroup = new FormGroup({
    nationality: new FormControl("", [Validators.required]),
    neighborhood: new FormControl(""),
    region: new FormControl(""),
    province: new FormControl(""),
    department: new FormControl(""),
    city: new FormControl(""),
    village: new FormControl(""),
    pincode: new FormControl(""),
  });

  public profileFields: FormGroup = new FormGroup(
    {
      address: new FormControl("", [Validators.required]),
      loc: new FormControl(""),
      hospitalName: new FormControl("", [Validators.required]),
      first_name: new FormControl("", [Validators.required]),
      middle_name: new FormControl(""),
      last_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      typeOfHealthCenter: new FormControl("", [Validators.required]),
      categoryOfHealthCenter: new FormControl("", [Validators.required]),
      mainPhone: new FormControl("", [Validators.required]),
      // mobilePhone: new FormControl("", [Validators.required]),
      phones: new FormArray([new FormControl("", [])], []),
      faxNumber: new FormControl(""),
      about: new FormControl(""),
      association: new FormGroup({
        enabled: new FormControl(true),
        name: new FormArray([]),
      }),
      name: new FormArray([new FormControl("", [])], []),
      bank_details: this.bankDataFields,
      ifu_details: this.ifUDataFields,

      show_to_patient: new FormControl(false),

      medical_act: new FormArray([new FormControl("", [])], []),
      lab_test: new FormArray([new FormControl("", [])], []),
      imaging: new FormArray([new FormControl("", [])], []),
      vaccination: new FormArray([new FormControl("", [])], []),
      other_test: new FormArray([new FormControl("", [])], []),

      location_info: this.locationFields,
      licence_details: new FormGroup({
        id_number: new FormControl("", [Validators.required]),
        expiry_date: new FormControl("", [Validators.required]),
        image: new FormControl(""),
      }),

      mobilePay: this.fb.array([]),
    },
    { validators: [] }
  );




  get medicine() {
    return this.profileFields.controls["mobilePay"] as FormArray;
  }

  addNewMobile() {
    const newmobilePay = this.fb.group({
      provider: [""],
      pay_number: [""],
      mobile_country_code: [this.countryCodes[0]]
    });
    this.medicine.push(newmobilePay);
  }




  deleteMobile(index: number) {
    this.medicine.removeAt(index);
  }

  phones = this.profileFields.get("phones") as FormArray;


  name = this.profileFields.get("name") as FormArray;

  private getLocationField(field: string) {
    return this.locationFields.get(field).value;
  }

  medical_act = this.profileFields.get("medical_act") as FormArray;
  lab_test = this.profileFields.get("lab_test") as FormArray;
  imaging = this.profileFields.get("imaging") as FormArray;
  vaccination = this.profileFields.get("vaccination") as FormArray;
  other_test = this.profileFields.get("other_test") as FormArray;

  ngOnInit(): void {
    this.getAllAssociationGroup();
    this.profileFields.controls["email"].patchValue(this.pharEmail);
    this.profileFields.controls["hospitalName"].patchValue(this.pharName);
    this.profileFields.controls["mainPhone"].patchValue(this.pharMobile);
    // this.profileFields.controls["mobilePhone"].patchValue(this.pharMobile);
    // this.profileFields.controls["country_code"].patchValue(this.selectedCountryCode);
    this.addNewMobile();
    this.getHealthCenterTypes();

    this.addnewRntry();
  }

  testExcelForm: FormGroup = new FormGroup({
    specialization_csv: new FormControl("", [Validators.required]),
  });

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  getCountryCode() {
    var country_code = '';

    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (countryData[i].dialCode === this.selectedCountryCodedb.split("+")[1]) {
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

  }

  myFilter = (d: Date | null): boolean => {

    return true;
  };

  private uploadDocument(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._hospitalService.uploadDocument(doc).subscribe({
        next: (result: IResponse<any>) => {
          let response = this._coreService.decryptObjectData({ data: result });
          resolve(response);
          reject(response);
        },
        error: (err: ErrorEvent) => {
          this._coreService.showError("", err.message);
        },
      });
    });
  }

  private getProfileField(...field: string[]) {
    return this.profileFields.get(field).value;
  }

  private getBankdataField(field: string) {
    return this.bankDataFields.get(field).value;
  }

  addAdditionalPhone() {
    (this.profileFields.get("phones") as FormArray).push(new FormControl(""));
  }

  removeAdditionalPhone(index: number) {
    (this.profileFields.get("phones") as FormArray).removeAt(index);
  }

  addAdditionalOtherTest() {
    (this.profileFields.get("other_test") as FormArray).push(
      new FormControl("")
    );
  }

  removeAdditionalOtherTest(index: number) {
    (this.profileFields.get("other_test") as FormArray).removeAt(index);
  }

  addAdditionalImaging() {
    (this.profileFields.get("imaging") as FormArray).push(new FormControl(""));
  }

  removeAdditionalImaging(index: number) {
    (this.profileFields.get("imaging") as FormArray).removeAt(index);
  }

  addAdditionalvaccination() {
    (this.profileFields.get("vaccination") as FormArray).push(
      new FormControl("")
    );
  }

  removeAdditionalvaccination(index: number) {
    (this.profileFields.get("vaccination") as FormArray).removeAt(index);
  }

  addAdditionalLabTest() {
    (this.profileFields.get("lab_test") as FormArray).push(new FormControl(""));
  }

  removeAdditionalLabTest(index: number) {
    (this.profileFields.get("lab_test") as FormArray).removeAt(index);
  }

  addAdditionalMatLife() {
    (this.profileFields.get("medical_act") as FormArray).push(
      new FormControl("")
    );
  }

  removeAdditionalMatLife(index: number) {
    (this.profileFields.get("medical_act") as FormArray).removeAt(index);
  }

  addAdditionalName() {
    (this.profileFields.get("name") as FormArray).push(new FormControl(""));
  }

  removeAdditionalName(index: number) {
    (this.profileFields.get("name") as FormArray).removeAt(index);
    this.arrayForAssociationGroupID.splice(index, 1);
  }

  updateMySelection(data: any, index: number) {
    console.log(data, index);
    this.arrayForAssociationGroupID[index] = data?.value;
    // console.log("this.arrayForAssociation",this.arrayForAssociationGroupID[index])
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.associationList.length > 0) {
      var result = this.associationList.filter((option: any) => {
        return option.name.toLowerCase().includes(filterValue);
      });
      return result.length > 0 ? result : ["No Data"];
    }
    return ["No Data"];
  }

  getAllAssociationGroup() {
    this._hospitalService.associationList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
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
      this.getProfile();
    });
  }

  handleSelectChange(event: any) {
    if (event.value === false) {
      this.profileFields.value.name.splice(0);
    }
  }

  onFileSelected(
    event,
    type: "licence" | "pharmacypictures" | "profilepicture"
  ) {
    console.log(event.target.files);


    const files: File[] = event.target.files;
    const formData: FormData = new FormData();

    formData.append(
      "userId",
      this.portalUserId
    );
    formData.append("docType", type);

    if (type === "pharmacypictures") {
      formData.append("multiple", "true");
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
      console.log("this.licence_doc10", this.licence_doc);
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.license_picture = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);

    }
    if (type === "pharmacypictures") {
      this.pharmacypictures = formData;
    }
    if (type === "profilepicture") {
      this.profilePicture = formData;
      console.log("this.licence_doc10", this.profilePicture);

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profile_picture = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

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

  public async createProfileData(): Promise<void> {

    console.log("this.profileFields====>", this.profileFields.value)
    if (this.profileFields.invalid) {
      this.profileFields.markAllAsTouched();
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid'
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this.toastr.error("All Field are required!")
      return;
    }
    this.loader.start();
    if (this.licence_doc) {
      await this.uploadDocument(this.licence_doc).then((res: any) => {
        console.log("Licence Card Response-->", res.data[0].Key);
        this.licence_doc = res.data[0].Key;
        this._coreService.showSuccess("", res.message);
      });
    }

    if (this.pharmacypictures) {
      console.log("Bulk run");
      await this.uploadDocument(this.pharmacypictures).then((res: any) => {
        this._coreService.showSuccess("", res.message);
        for (let doc of res.data) {
          this.docArray.push(doc.Key);
        }
      });
    }

    if (this.profilePicture) {
      await this.uploadDocument(this.profilePicture).then((res: any) => {
        this.profilePicture = res.data[0].key
        this._coreService.showSuccess("", res.message);
      });
    }


    const profileRequest = {
      hospitalAdminId: this.portalUserId,
      hospital_name: this.getProfileField("hospitalName"),
      first_name: this.getProfileField("first_name"),
      email: this.getProfileField("email"),
      middle_name: this.getProfileField("middle_name"),
      last_name: this.getProfileField("last_name"),
      type_of_health_center: this.getProfileField("typeOfHealthCenter"),
      category_of_health_center: this.getProfileField("categoryOfHealthCenter"),
      main_phone_number: this.getProfileField("mainPhone"),
      // mobile_phone_number: this.getProfileField("mobilePhone"),
      country_code: this.selectedCountryCode,
      category_phone_number: this.getProfileField("phones"),
      fax_number: this.getProfileField("faxNumber"),
      about_hospital: this.getProfileField("about"),
      association: {
        is_true: this.getProfileField("association", "enabled"),
        name: this.arrayForAssociationGroupID,
      },
      patient_portal: this.getProfileField("show_to_patient"),
    
      pathologyInfo:this.allTestsList,
      bankInfo: {
        bank_name: this.getBankdataField("bank_name"),
        account_holder_name: this.getBankdataField("account_holder_name"),
        account_number: this.getBankdataField("account_number"),
        ifsc_code: this.getBankdataField("ifsc_code"),
        bank_address: this.getBankdataField("bank_address"),
      },
      ifu_number: this.getProfileField("ifu_details", "ifuNumber"),
      rccm_number: this.getProfileField("ifu_details", "rccmNumber"),
      licence: {
        number: this.getProfileField("licence_details", "id_number"),
        expiry_date:
          this.getProfileField("licence_details", "expiry_date")
      },
      addressInfo: {

        loc: this.getProfileField("loc"),
        address: this.getProfileField("address"),
        country: this.getLocationField("nationality"),
        neighborhood: this.getLocationField("neighborhood"),
        region: this.getLocationField("region"),
        province: this.getLocationField("province"),
        department: this.getLocationField("department"),
        city: this.getLocationField("city"),
        village: this.getLocationField("village"),
        pincode: this.getLocationField("pincode"),
      },
      mobilePay: this.getProfileField("mobilePay"),
    };
    console.log("profileRequest--->", profileRequest);
    if (this.profilePicture != null) {
      profileRequest['profile_picture'] = this.profilePicture
    }
    if (this.licence_doc != null) {
      profileRequest.licence['image'] = this.licence_doc
    }
    if (this.docArray.length > 0) {
      profileRequest['hospitalPictures'] = this.docArray
    }

    this._hospitalService.createProfile(profileRequest).subscribe({
      next: (result: any) => {
        let response = this._coreService.decryptObjectData({ data: result });
        console.log("response>>>>>>>>>", response)
        console.log(response);
        if (response.status) {
          this.loader.stop();
          this._coreService.setLocalStorage(
            response?.body?.hospitalAdminInfo,
            "adminData"
          );
          this._coreService.setLocalStorage(
            response?.body?.PortalUserDetails,
            "loginData"
          );
          this.router.navigate(['/hospital/profile']);
          this.getProfile();
        } else {
          this.loader.stop();
          this._coreService.showError("", response.message);
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();
        this._coreService.showError("", err.message);
      },
    });
  }

  getProfile() {
    this._hospitalService.viewProfile(this.portalUserId).subscribe({
      next: (result: any) => {
        let response = this._coreService.decryptObjectData({ data: result });
        console.log("GET PROFILE DETAILS=====>", response)
        let userDetails = response.body.userDetails;
        this.adminDetails = response.body.userDetails;
        if (response.body.pathology_tests.length > 0) {
          this.allTestsList = response.body.pathology_tests;
        } else {
          this.allTestsList = [];
        }
        // console.log("userDetails==", userDetails)
        let portalDetails = response?.body?.portalDetails;
        // console.log("portalDetails==", portalDetails)
        // this.adminDetails?.association?.is_true.
        this.profile_picture = userDetails?.profile_picture
        this.license_picture = userDetails?.license?.image
        this.healthCenter = response?.body?.type_of_health_center_Data?.body?.data?._id
        console.log("HportalDetails==", this.healthCenter)

        this.pharmacyPicUrl = [];
        userDetails?.hospitalPictures.forEach((element) => {
          this.pharmacyPicUrl.push(element);
        });

        if (userDetails?.in_mobile_pay) {
          userDetails?.in_mobile_pay?.mobilePay.forEach((element) => {
            // this.addNewMobile();
          });
        } else {
          this.addNewMobile();
        }

        this.profileFields.patchValue({
          ...portalDetails,
          hospitalName: userDetails?.hospital_name,
          first_name: userDetails?.first_name,
          middle_name: userDetails?.middle_name,
          last_name: userDetails?.last_name,
          typeOfHealthCenter: userDetails?.type_of_health_center?._id,
          categoryOfHealthCenter: userDetails?.category_of_health_center,
          mainPhone: portalDetails?.mobile,
          // mobilePhone: userDetails?.mobile_phone_number,
          country_code: portalDetails?.country_code,
          faxNumber: userDetails?.fax_number,
          about: userDetails?.about_hospital,
          address: userDetails?.in_location?.address,
          medical_act: userDetails?.in_pathology_test?.medical_act,
          lab_test: userDetails?.in_pathology_test?.lab_test,
          imaging: userDetails?.in_pathology_test?.imaging,
          vaccination: userDetails?.in_pathology_test?.vaccination,
          other_test: userDetails?.in_pathology_test?.other_test,
          ifu_details: {
            ifuNumber: userDetails?.ifu_number,
            rccmNumber: userDetails?.rccm_number,
          },
          association: { enabled: this.adminDetails?.association?.is_true },
          show_to_patient: userDetails?.patient_portal ,
          licence_details: {
            id_number: userDetails?.license?.number,
            expiry_date: userDetails?.license?.expiry_date,
            image: userDetails?.license?.image,
          },

          mobilePay: userDetails?.in_mobile_pay?.mobilePay,
        });

        // if (userDetails?.in_mobile_pay) {
        //   userDetails?.in_mobile_pay?.mobilePay.forEach((element) => {
        //     this.addNewMobile();
        //   });
        // } else {
        //   this.addNewMobile();
        // }

        if (userDetails?.category_phone_number?.length != 0) {
          const nameFormArray = this.profileFields.get('phones') as FormArray;
          while (nameFormArray.length) {
            nameFormArray.removeAt(0);
          }
          userDetails?.category_phone_number.forEach(value => {
            nameFormArray.push(this.fb.control(value));
          });
        } else {
          this.addAdditionalPhone();
        }

        // if (userDetails?.category_phone_number.length === 0) {
        //   console.log('vikas1');

        //   this.addAdditionalPhone();
        // } else {
        //   console.log('vikas2');

        //   userDetails?.category_phone_number.forEach((element) => {            
        //     this.phoneArray.push(element);
        //     // this.addAdditionalPhone();
        //   });
        // }
        // this.profileFields.patchValue({
        //   phones: this.phoneArray,
        //   // name: userDetails?.association?.name,
        //   // name:userDetails?.association?.name.forEach((element) => {            
        //   //   this.arrayForAssociationGroupID.push(element);
        //   //   this.addAdditionalName();
        //   // })
        // });
        // Check if userDetails.association.name has values
        if (userDetails?.association?.name && userDetails.association.name.length > 0) {
          // Clear existing form controls
          const nameFormArray = this.profileFields.get('name') as FormArray;
          while (nameFormArray.length) {
            nameFormArray.removeAt(0);
          }

          // Add form controls based on the length of userDetails.association.name
          userDetails.association.name.forEach(value => {
            nameFormArray.push(this.fb.control(value));
          });
        }
        console.log("phone--->", this.profileFields.value.phones);
        this.locationFields.patchValue({
          neighborhood: userDetails?.in_location?.neighborhood,
          nationality: userDetails?.in_location?.country,
          region: userDetails?.in_location?.region,
          province: userDetails?.in_location?.province,
          department: userDetails?.in_location?.department,
          city: userDetails?.in_location?.city,
          village: userDetails?.in_location?.village,
          pincode: userDetails?.in_location?.pincode
        });

        this.bankDataFields.patchValue({
          ...userDetails?.in_bank,
        });
        this.selectedCountryCodedb = portalDetails?.country_code
        this.getCountryCode();
        console.log("country_code", this.selectedCountryCodedb);


        this.showAddressComponent = true;
      },

      error: (err: ErrorEvent) => {
        this._coreService.showError("", err.message);
      },
    });
  }


  getHealthCenterTypes() {
    this.superAdmin.getHealthCenterTypes().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        // console.log("response",response);

        const healthCenterTypes = response?.result;
        // console.log("getHealthCenterTypes--->", this.healthCenterTypes);

        healthCenterTypes.map((healthCenterType) => {
          this.healthCenterTypes.push(
            {
              value: healthCenterType._id,
              label: healthCenterType.name
            }
          )
        })
      } else {
        this._coreService.showError("", response.message)
      }
    })
  }



  removeSelectpic(data: any, index: any = '') {
    console.log("data-->", data);

    if (data === 'profile_picture') {
      this.profile_picture = ""
    } else if (data === 'license_picture') {
      this.license_picture = "";
    }
    else if (data === 'pharmacyPicUrl') {
      this.pharmacyPicUrl.splice(index, 1);
      this.docArray.splice(index, 1);
    }
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.manualForm.reset();
    this.isSubmitted = false;
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
  
    if (fileList.length > 0) {
      let file: File = fileList[0];
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
  
        // Assuming you're reading the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Convert the sheet data to an array of objects
        const excelData = XLSX.utils.sheet_to_json(sheet);
  
        const firstRow = excelData[0]; // Get the first row assuming it contains column headers
  
        const expectedHeaders = ['Type Of Test', 'Name Of Test'];
  
        if (
          firstRow.hasOwnProperty(expectedHeaders[0]) &&
          firstRow.hasOwnProperty(expectedHeaders[1])
        ) {
          this.isColumnNameCorrect = true;
          // Column headers are as expected
          console.log('Column headings are correct for both columns');
          // Proceed with processing the data
          for (const value of excelData) {
            // Check for duplicate records before pushing
            const existingRecord = this.allTestsList.find(test => test.typeOfTest === value['Type Of Test'] && test.nameOfTest === value['Name Of Test']);
            if (existingRecord) {
              existingRecord.isExist = true; // Mark as duplicate
              this.toastr.error("Duplicate record found for: " + value['Type Of Test'] + " - " + value['Name Of Test'], "Warning");
            } else {
              this.allTestsList.push({
                typeOfTest: value['Type Of Test'],
                nameOfTest: value['Name Of Test'],
                isExist: false
              });
            }
          }
        } else {
          this.isColumnNameCorrect = false;
          this.toastr.error("Incorrect column Names", "Error")
          console.log('Incorrect column headings. Expected: "Type Of Test" and "Name Of Test"');
          // Handle the error or adjust as needed
        }
      };
  
      reader.readAsArrayBuffer(file);
    }
  }
  

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/Tests.xlsx");
    link.setAttribute("download", `Tests.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  excleSubmit() {


    this.isSubmitted = true;
    if (this.testExcelForm.invalid) {
      console.log("Invaliddd_______");
      this.toastr.error("Please select the excel","Error")
      return;
    }
    if(!this.isColumnNameCorrect){
      this.toastr.error("Incorrect column Names","Error")
    }
   
    if (!this.isColumnNameCorrect) {
      this.toastr.error("Incorrect column Names", "Error")
    } 
  }

  openImportTestPopup(importTests: any) {
    this.modalService.open(importTests, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }

  deleteTestIndex:any =[];
  openDelTestPopup(deleteTestPopup: any, test: any, index: any) {
    console.log(index, "test__________", test);
    this.deleteTestIndex = index; // Store the index of the test to be deleted
    this.deleteTestData = {
      for_portal_user: test.for_portal_user,
      typeOfTest: test.typeOfTest,
      nameOfTest: test.nameOfTest,
    };
  
    this.modalService.open(deleteTestPopup, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }
  
  removeTest() {
    console.log("deleteTestData__________", this.deleteTestData);
    this.loader.start();
    this._hospitalService.deletePathologyTest(this.deleteTestData).subscribe((res: any) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.loader.stop();
        this.toastr.success(response.message, "Success");
  
        // Remove the test from alltestlist array
        this.allTestsList.splice(this.deleteTestIndex, 1);
  
        // Close the popup
        this.closePopup();
        console.log(response, "responseeee______");
      } else {
        this.loader.stop();
      }
    });
  }

  getDetailsForLabTest() {
    this._hospitalService.viewProfile(this.portalUserId).subscribe({
      next: (result: any) => {
        let response = this._coreService.decryptObjectData({ data: result });
        if (response.body.pathology_tests.length > 0) {
          this.allTestsList = response.body.pathology_tests;
        }
      },
      error: (err: ErrorEvent) => {
        this._coreService.showError("", err.message);
      },
    });
  }

  openVerticallyCenteredaddmanually(addmanualcontent: any) {
    this.modalService.open(addmanualcontent, {
      centered: true,
      size: "md",
      windowClass: "add_role",
    });
  }

  newManualEntryForm(): FormGroup {
    return this.fb.group({
      typeOfTest: ["", [Validators.required]],
      nameOfTest: ["", [Validators.required]],
    });
  }

  get manualentries(): FormArray {
    return this.manualForm.get("manualentries") as FormArray;
  }

  addnewRntry() {
    this.manualentries.push(this.newManualEntryForm());
  }

  removeEntry(i: number) {
    this.manualentries.removeAt(i);
  }

  addManualtest() {
    this.isSubmitted = true;
    if (this.manualForm.invalid) {
      return;
    }
    this.loader.start();
    let reqData = {
      entriesArray: this.manualForm.value.manualentries,
      added_by: this.portalUserId
    };
    console.log("REQUEST DATA===>", reqData);
    this._hospitalService.addManualTestss(reqData).subscribe(
      (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, "");
          this.getDetailsForLabTest();
          this.manualForm.markAsUntouched();
          this.manualForm.reset();
          this.closePopup();
        } else {
          this.loader.stop();
          this._coreService.showError("", result?.message)
        }
      },
      (error) => {
        this.loader.stop();
        console.log("error in add role", error);
      }
    );

  }

  get g() {
    return this.editmanualForm.controls;
  }

  editVerticallyCenteredtest(edittests: any, data: any) {
    this.testIdForUpdate = data._id;
    this.editmanualForm.patchValue({
      id: data._id,
      typeOfTest: data.typeOfTest,
      nameOfTest: data.nameOfTest,
    });

    this.modalService.open(edittests, {
      centered: true,
      size: "md",
      windowClass: "edit_role",
    });
  }

  editTest() {
    this.isSubmitted = true;
    if (this.editmanualForm.invalid) {
      this._coreService.showError("Please enter all fields", "");
      return
    }
    this.isSubmitted = false;
    let formValues = this.editmanualForm.value;
    this.loader.start();
    let dataToPass = {
      id: this.testIdForUpdate,
      typeOfTest: formValues.typeOfTest,
      nameOfTest: formValues.nameOfTest,
      loggedInId: this.portalUserId
    };
    console.log(dataToPass);

    this._hospitalService.editTests(dataToPass).subscribe((res: any) => {
      let DecryptResponse = this._coreService.decryptObjectData({ data: res });

      if (DecryptResponse.status == true) {
        this.loader.stop();
        this._coreService.showSuccess("", DecryptResponse?.message);
        this.getDetailsForLabTest();
        this.modalService.dismissAll("Closed");
        this.editmanualForm.reset();
        // this.roleList();
      } else {
        this.loader.stop();
        this._coreService.showError("", DecryptResponse?.message)
      }
    });
  }
}
