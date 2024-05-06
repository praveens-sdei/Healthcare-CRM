import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import intlTelInput from "intl-tel-input";
import { MatStepper } from "@angular/material/stepper";
import Validation from "src/app/utility/validation";
import { ActivatedRoute } from "@angular/router";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: "app-basicinfo",
  templateUrl: "./basicinfo.component.html",
  styleUrls: ["./basicinfo.component.scss"],
})
export class BasicinfoComponent implements OnInit {

  specialities = new FormControl("");
  specialityList: string[] = [
    "Speciality1",
    "Speciality2",
    "Speciality3",
    "Speciality4",
  ];
  services = new FormControl("");
  serviceList: string[] = [
    "Service1",
    "Service2",
    "Service3",
    "Service4",
    "Service5",
  ];
  departments = new FormControl("");
  departmentsList: string[] = [
    "Department1",
    "Department2",
    "Department3",
    "Department4",
  ];
  units = new FormControl("");
  unitList: string[] = ["Unit1", "Unit2", "Unit3", "Unit4"];
  experties = new FormControl("");
  expertiesList: string[] = [
    "Expertise1",
    "Expertise2",
    "Expertise3",
    "Expertise4",
    "Expertise5",
  ];

  @Input() public mstepper: MatStepper;
  @ViewChild("mobile") mobile: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  hospitalId: any = "";
  basicInfo: any = FormGroup;
  isSubmitted: boolean = false;
  profileImage: any = "";
  profileImageFile: FormData = null;
  licenseFile: FormData = null;
  
  iti: any;
  selectedCountryCode: any;
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};

  locationData: any;
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];

  pageForAdd: any = true;
  profileDetails: any;
  doctorId: any = "";
  doctorRole: any = "";

  stepper: any;
  selectedcountrycodedb: any='';
  license_picture: any = null;
  titleList: any[] = [];
  deginationList: any[] =[];
  designation: any;
  selectedLanguages:any = [];

  isSubmitted1:Boolean = false;
  allTestsList:any = [];
  deleteTestData:any = {};
  isColumnNameCorrect:boolean = false;
  countryCodes: string[];
  selectedSpecialities:any=[];
  selectedSpeciality: any=[];
  overlay:false;
  manualForm: FormGroup;
  editmanualForm: FormGroup;
  testIdForUpdate: any;
  staffselected: any=[];
  selectedStaff: any=[];
  staffList: any[] = [];
  basicDetails : any = {};
  readonlyMode: boolean = true; // Set it to true or false based on your requirements
  constructor(
    private toastr: ToastrService,
    private service: HospitalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private individualDoctorService: IndiviualDoctorService,
    private modalService:NgbModal,
    private loader: NgxUiLoaderService
  ) {
    this.basicInfo = this.fb.group({
      profilePicture: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      address: ["", [Validators.required]],
      loc: [""],
      neighborhood: [""],
      nationality: ["", [Validators.required]],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      village: [""],
      pincode: [""],
      mobile: [
        "",
        [Validators.required, Validators.pattern(/^\d{1,100}$/)],
      ],
      dob: ["", [Validators.required]],
      date_of_join: [""],
      designation: ["", [Validators.required]],
      title: ["", [Validators.required]],
      experience: ["", [Validators.required]],
      assignDoctor: [""],
      assignStaff: [""],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      gender: ["", [Validators.required]],
      language: ["", [Validators.required]],
      userName: [""],
      urgent_care_service: [false],
      aboutDoctor: [""],

      license_details: this.fb.group({
        license_number: ["", [Validators.required]],
        license_expiry_date: ["", [Validators.required]],
        license_picture: [""],
      }),

      speciality: ["", [Validators.required]],
      service: [""],
      departmentt: [""],
      unit: [""],
      expertise: [""],

      // medicalActPerformed: this.fb.array([]),
      // labTestPerformed: this.fb.array([]),
      // imagingPerformed: this.fb.array([]),
      // vaccinationPerformed: this.fb.array([]),
      // otherTest: this.fb.array([]), 

      bank_details: this.fb.group({
        account_holder_name: [""],
        account_number: [""],
        bank_address: [""],
        bank_name: [""],
        ifsc_code: [""],
      }),

      mobilePayDetails: this.fb.array([]),
      association: this.fb.group({
        enabled: [false],
        name: [],
      }),
      slogan: [""],
      appointment_accepted: this.fb.group({
        online: [false],
        homevisit: [false],
        hospitalvisit: [false],
      }),
      show_to_patient: [false],
    });

    this.manualForm = this.fb.group({
      manualentries: this.fb.array([]),
    });

    this.editmanualForm = this.fb.group({
      typeOfTest: ["", [Validators.required]],
      nameOfTest: ["", [Validators.required]]
    });

    this.countryCodes =  ["+226(BF)","+229(BJ)", "+225(CI)", "+223(ML)", "+221(SN)", "+228(TG)"];
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  ngAfterViewInit() {
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
      this.basicInfo.patchValue({
        address: place.formatted_address,
        loc: this.loc,
      });
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));

    this.doctorId = loginData?._id;
    this.doctorRole = loginData?.role;

    
    if (this.doctorRole === "HOSPITAL_DOCTOR") {
      let adminData = JSON.parse(localStorage.getItem("adminData"));
      this.hospitalId = adminData?.for_hospital;
      this.getStaffList();
    }

    this.getCountryList();
    this.getSpokenLanguage();

    this.getDoctorDetails(this.mstepper);
    this.getSpecialities();
    this.getAllDesignation();
    this.getAllTitle();
    this.addnewRntry();
  }

  testExcelForm: FormGroup = new FormGroup({
    specialization_csv: new FormControl("", [Validators.required]),
  });

  //For Edit Doctor
  getDoctorDetails(fromParent: any) {
    let response = fromParent?.response;
    this.stepper = fromParent?.mainStepper;

    this.profileDetails = response?.data?.result[0];
    
    if(response.data.pathology_tests.length>0){
      this.allTestsList = response.data.pathology_tests;
      console.log(this.allTestsList,"allTestsListtt_____",response?.data);
    }else{
      this.allTestsList = [];
    }
    console.log(response.data.pathology_tests,"profileDetailsss__________");
    this.selectedLanguages = this.profileDetails.spoken_language;

    this.profileImage = this.profileDetails?.profile_picture?.url;
    this.patchValues(this.profileDetails);
    this.basicDetails= {...this.profileDetails}
    this.locationData = response?.data?.result[0]?.in_location;
    if (this.locationData) {
      // this.getRegionList(this.locationData?.country);
      // this.getProvienceList(this.locationData?.region);
      // this.getDepartmentList(this.locationData?.province);
      // this.getCityList(this.locationData?.department);
    }
  }



  getDoctorDetailsForLabTest() {
    this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if(response.data.pathology_tests.length>0){
        this.allTestsList = response.data.pathology_tests;
      }else{
        this.allTestsList = [];
      }
    }, err => {
      let errResponse = this.coreService.decryptObjectData({ data: err.error })
      this.toastr.error(errResponse.message)
    });
  }

  //-----------patch values---------
  patchValues(data: any) {
    console.log("data>>>>>>>>",data)
  //    let medArray = [];
  //   let labArray = [];
  //   let imgArray = [];
  //   let vacArray = [];
  //   let otherArray = []; 
     this.selectedcountrycodedb=data?.for_portal_user?.country_code

  //  if (data?.medical_act_performed.length != 0) {
  //     data?.medical_act_performed.forEach((element) => {
  //       this.addNewMedAct();
  //       medArray.push({ act: element });
  //     });
  //   } else {
  //     this.addNewMedAct();
  //   }

  //   if (data?.lab_test_performed.length != 0) {
  //     data?.lab_test_performed.forEach((element) => {
  //       this.addNewLabTest();
  //       labArray.push({ test: element });
  //     });
  //   } else {
  //     this.addNewLabTest();
  //   }

  //   if (data?.imaging_performed.length != 0) {
  //     data?.imaging_performed.forEach((element) => {
  //       this.addNewImg();
  //       imgArray.push({ img: element });
  //     });
  //   } else {
  //     this.addNewImg();
  //   }

  //   if (data?.vaccination_performed.length != 0) {
  //     data?.vaccination_performed.forEach((element) => {
  //       this.addNewVac();
  //       vacArray.push({ vac: element });
  //     });
  //   } else {
  //     this.addNewVac();
  //   }

  //   if (data?.other_test.length != 0) {
  //     data?.other_test.forEach((element) => {
  //       this.addOtherTest();
  //       otherArray.push({ other: element });
  //     });
  //   } else {
  //     this.addOtherTest();
  //   } 

    if (data?.in_mobile_pay) {
      data?.in_mobile_pay?.mobilePay.forEach((element) => {
        this.addMobPay();
      });
    } else {
      this.addMobPay();
    }
    this.license_picture = data?.license_details?.image_url,
    this.basicInfo.patchValue({
      ...data,
      ...data?.in_location,
      ...data?.for_portal_user,
      experience: data?.years_of_experience,
      language: this.selectedLanguages,
      aboutDoctor: data?.about,
      license_details: {
        license_number: data?.license_details?.license_number,
        license_expiry_date: data?.license_details?.license_expiry_date,
      },

      // medicalActPerformed: medArray,
      // labTestPerformed: labArray,
      // imagingPerformed: imgArray,
      // vaccinationPerformed: vacArray,
      // otherTest: otherArray,

      bank_details: data?.in_bank,
      mobilePayDetails: data?.in_mobile_pay?.mobilePay,
      assignDoctor: data?.assign_doctor[0]?._id,
      // assignStaff: data?.assign_staff[0]?._id,
      departmentt: data?.department?._id,
      service: data?.services?._id,
      unit: data?.unit?._id,
      expertise: data?.expertise?._id,
      nationality: data?.in_location?.country,
      profilePicture: data?.profile_picture?._id,
      // speciality: data?.speciality?._id,
      assignStaff: data?.assign_staff
    });
    for(let data1 of data?.assign_staff){
      this.staffselected.push(data1?._id)
    }
    console.log("this.staffselected>>>>>>", this.staffselected)
    // this.selectedSpeciality = data?.speciality?._id;
    for(let data1 of data?.speciality){
      this.selectedSpeciality.push(data1?._id)
    }

    // this.specialities.setValue(data?.speciality);    
    this.services.setValue(data?.services);
    this.departments.setValue(data?.department);
    this.experties.setValue(data?.expertise);
    this.units.setValue(data?.unit);
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

  //For Add Doctor
  async handleSaveBasicInfo() {
    this.isSubmitted = true;
    if (this.basicInfo.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this.coreService.showError("","Please fill all required fields." )
      const invalid = [];
      const controls = this.basicInfo.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      return;      
    }
    this.isSubmitted = false;
    this.loader.start();
    if (this.licenseFile) {
      await this.uploadDocument(this.licenseFile).then((res: any) => {
        this.license_picture = res.data[0],
        this.basicInfo.patchValue({
          license_details: {
            license_picture: res.data[0],
          },
        });
      });
    }

    if (this.profileImageFile) {
      await this.uploadDocument(this.profileImageFile).then((res: any) => {
        this.basicInfo.patchValue({
          profilePicture: res.data[0],
        });
      });
    }

    let data = this.basicInfo.value;

    // let medicalActPerformed = [];
    // let labTestPerformed = [];
    // let imagingPerformed = [];
    // let vaccinationPerformed = [];
    // let otherTest = [];

    // data.medicalActPerformed.forEach((element) => {
    //   medicalActPerformed.push(element?.act);
    // });

    // data.labTestPerformed.forEach((element) => {
    //   labTestPerformed.push(element?.test);
    // });

    // data.imagingPerformed.forEach((element) => {
    //   imagingPerformed.push(element?.img);
    // });

    // data.vaccinationPerformed.forEach((element) => {
    //   vaccinationPerformed.push(element?.vac);
    // });

    // data.otherTest.forEach((element) => {
    //   otherTest.push(element?.other);
    // });  


    var reqData = {
      doctor_profile_object_id: data?.profilePicture,
      first_name: data?.first_name,
      middle_name: data?.middle_name,
      last_name: data?.last_name,
      address: data?.address,
      loc:data?.loc,
      neighborhood: data?.neighborhood,
      country: data?.nationality,
      region: data?.region,
      province: data?.province,
      location_department: data?.department,
      city: data?.city,
      village: data?.village,
      pincode: data?.pincode,
      mobile: data?.mobile,
      country_code: this.selectedCountryCode,
      dob: data?.dob,
      designation: data?.designation,
      title: data?.title,
      years_of_experience: data?.experience,
      // assign_doctor: data?.assignDoctor,
      assign_staff: data?.assignStaff,
      email: data?.email,
      gender: data?.gender,
      spoken_language: this.selectedLanguages,
      urgent_care_service: data?.urgent_care_service,
      about: data?.aboutDoctor,
      license_number: data?.license_details?.license_number,
      license_expiry_date: data?.license_details?.license_expiry_date,
      license_image_object_id: data?.license_details?.license_picture,
      // speciality: data?.speciality,
      speciality:this.selectedSpecialities,
      // services: data?.service,
      // department: data?.departmentt,
      // unit: data?.unit,
      // expertise: data?.expertise,

      // medical_act_performed: medicalActPerformed,
      // lab_test_performed: labTestPerformed,
      // imaging_performed: imagingPerformed,
      // vaccination_performed: vaccinationPerformed,
      // other_test: otherTest,

      pathologyInfo:this.allTestsList,

      bank_name: data?.bank_details?.bank_name,
      bank_address: data?.bank_details?.bank_address,
      account_holder_name: data?.bank_details?.account_holder_name,
      account_number: data?.bank_details?.account_number,
      ifsc_code: data?.bank_details?.ifsc_code,
      mobile_pay_details: data?.mobilePayDetails,
      for_hospital: "",
      id: this.doctorId,
      appointment_accepted:data?.appointment_accepted
    };

    // if(this.pageForAdd){
    //   reqData.for_hospital=this.hospitalId
    // }else{
    //   reqData.id=this.doctorId
    // }

    console.log("REQUEST DATA ======>", reqData);
// return;
    this.service.basicInformation(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("response>>>>>>>>>>",response)
        if (response.status) {
          this.loader.stop();
          this.coreService.setLocalStorage(
            response?.data?.updatedBasicInfoDetails,
            "adminData"
          );
          this.coreService.setLocalStorage(
            response?.data?.PortalUserDetails,
            "loginData"
          );
          this.toastr.success(response.message);
          sessionStorage.setItem("doctorId", response?.data?.portal_user_id);
          this.stepper.next();
        }else{
          this.loader.stop();
          this.coreService.showError("", response.message);          
        }
      },
      (err) => {
        this.loader.stop();
        console.log(err);
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  onFileSelected(event, type: "profile" | "license") {
    let file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append("portal_user_id", this.doctorId);
    formData.append("docType", type);
    // formData.append("multiple", "false");
    formData.append("documents", file);

    if (type === "license") {
      this.licenseFile = formData;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.license_picture = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    if (type === "profile") {
      this.profileImageFile = formData;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileImage = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private uploadDocument(doc: FormData) {
    return new Promise((resolve, reject) => {
      this.service.uploadFileForPortal(doc).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          resolve(response);
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.messgae);
        }
      );
    });
  }


  getStaffList() {
    let reqData = {
      hospitalId: this.hospitalId,
      page: 1,
      limit: 110,
      searchText: "",
      role: "",
    };

    this.service.getAllStaff(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.staffList = response?.body[0]?.paginatedResults;
      const arr = response?.body[0]?.paginatedResults;

      arr.map((curentval: any) => {
        this.staffList.push({
          label: curentval?.profileinfos?.name,
          value: curentval?.profileinfos?._id
        });
      });
      console.log("staffList--->>>>",this.staffList)
      this.basicInfo.patchValue({
        assignStaff: this.staffselected
       })
    });
  }

  //------------------------------FORM ARRAY HANDLING----------------------------------
  //---------Med Act Performed-----------1)
  // f1Validation(index) {
  //   let abc = this.basicInfo.get("medicalActPerformed") as FormArray;
  //   const formGroup = abc.controls[index] as FormGroup;
  //   return formGroup;
  // }

  // get medicalActPerformed() {
  //   return this.basicInfo.controls["medicalActPerformed"] as FormArray;
  // }

  // addNewMedAct() {
  //   const newMedicalAct = this.fb.group({
  //     act: ["", [Validators.required]],
  //   });
  //   this.medicalActPerformed.push(newMedicalAct);
  // }

  // removeMedAct(index: number) {
  //   this.medicalActPerformed.removeAt(index);
  // }

  // //---------Lab Test Performed-----------2)
  // f2Validation(index) {
  //   let abc = this.basicInfo.get("labTestPerformed") as FormArray;
  //   const formGroup = abc.controls[index] as FormGroup;
  //   return formGroup;
  // }

  // get labTestPerformed() {
  //   return this.basicInfo.controls["labTestPerformed"] as FormArray;
  // }

  // addNewLabTest() {
  //   const newLab = this.fb.group({
  //     test: ["", [Validators.required]],
  //   });
  //   this.labTestPerformed.push(newLab);
  // }

  // removeLabTest(index: number) {
  //   this.labTestPerformed.removeAt(index);
  // }

  // //---------Imaging Performed-----------3)
  // f3Validation(index) {
  //   let abc = this.basicInfo.get("imagingPerformed") as FormArray;
  //   const formGroup = abc.controls[index] as FormGroup;
  //   return formGroup;
  // }

  // get imagingPerformed() {
  //   return this.basicInfo.controls["imagingPerformed"] as FormArray;
  // }

  // addNewImg() {
  //   const newImg = this.fb.group({
  //     img: ["", [Validators.required]],
  //   });
  //   this.imagingPerformed.push(newImg);
  // }

  // removeImg(index: number) {
  //   this.imagingPerformed.removeAt(index);
  // }
  // //---------Vaccination Performed-----------4)
  // f4Validation(index) {
  //   let abc = this.basicInfo.get("vaccinationPerformed") as FormArray;
  //   const formGroup = abc.controls[index] as FormGroup;
  //   return formGroup;
  // }

  // get vaccinationPerformed() {
  //   return this.basicInfo.controls["vaccinationPerformed"] as FormArray;
  // }

  // addNewVac() {
  //   const newVac = this.fb.group({
  //     vac: ["", [Validators.required]],
  //   });
  //   this.vaccinationPerformed.push(newVac);
  // }

  // removeVac(index: number) {
  //   this.vaccinationPerformed.removeAt(index);
  // }

  // //---------Other Test Performed-----------5)
  // f5Validation(index) {
  //   let abc = this.basicInfo.get("otherTest") as FormArray;
  //   const formGroup = abc.controls[index] as FormGroup;
  //   return formGroup;
  // }

  // get otherTest() {
  //   return this.basicInfo.controls["otherTest"] as FormArray;
  // }

  // addOtherTest() {
  //   const addOther = this.fb.group({
  //     other: ["", [Validators.required]],
  //   });
  //   this.otherTest.push(addOther);
  // }

  // removeOtherTeest(index: number) {
  //   this.otherTest.removeAt(index);
  // } 

  //---------Mobile Pay Details-----------6)
  mobilePayValidation(index) {
    let abc = this.basicInfo.get("mobilePayDetails") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get mobilePayDetails() {
    return this.basicInfo.controls["mobilePayDetails"] as FormArray;
  }

  addMobPay() {
    const addMobPay = this.fb.group({
      provider: [""],
      pay_number: [
        ""
      ],
      mobile_country_code: [this.countryCodes[0]]
    });
    this.mobilePayDetails.push(addMobPay);
  }

  removeMobPay(index: number) {
    this.mobilePayDetails.removeAt(index);
  }
  //----------------------------------------------------------------------------
  specialityListt: any[] = [];
  getSpecialities() {
    this.service.getAllSpeciality().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.specialityListt = response?.body?.data;
      const arr = response?.body?.data;
      arr.map((curentval: any) => {
        this.specialityListt.push({
          label: curentval?.specilization,
          value: curentval?._id,
        });
      });     
      
      this.basicInfo.patchValue({
         speciality: this.selectedSpeciality
      });
    });
  }

  //------------address component api's-------------
  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.spokenLanguages = response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;
      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });  
      this.basicInfo.patchValue({
        language: this.selectedLanguages
     });
    });
  }

  getCountryList() {
    this.countryList=[]
    this.sadminService.getcountrylist().subscribe({
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
        this.basicInfo.get("nationality").patchValue(this.basicDetails.in_location.country)
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
        let result = this.coreService.decryptObjectData({ data: res });
        const regionList = result.body?.list;
        regionList.map((region)=>{
          this.regionList.push(
            {
              label :region.name,
              value :region._id
            }
          )
        })
             this.basicInfo.get("region").patchValue(this.basicDetails.in_location.region)
      if(!this.basicInfo.get("region").value){
        this.basicInfo.get("department").patchValue("")
        this.basicInfo.get("city").patchValue("")
        this.basicInfo.get("village").patchValue("")
        this.basicInfo.get("province").patchValue("")
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
        let result = this.coreService.decryptObjectData({ data: res });
        const provienceList = result.body?.list;
        provienceList.map((province)=>{
          this.provienceList.push(
            {
              label :province.name,
              value :province._id
            }
          )
        })
        this.basicInfo.get("province").patchValue(this.basicDetails.in_location.province)
        if(!this.basicInfo.get("province").value){
          this.basicInfo.get("department").patchValue("")
          this.basicInfo.get("city").patchValue("")
          this.basicInfo.get("village").patchValue("")
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
        let result = this.coreService.decryptObjectData({ data: res });
        const departmentList = result.body?.list;
        departmentList.map((department)=>{
          this.departmentList.push(
            {
              label :department.name,
              value :department._id
            }
          )
        })
        this.basicInfo.get("department").patchValue(this.basicDetails.in_location.department)
        if(!this.basicInfo.get("department").value){
          this.basicInfo.get("city").patchValue("")
          this.basicInfo.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.cityList = [],
    this.villageList = []
    if(!departmentID){
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const cityList = result.body.list;
        cityList.map((city)=>{
          this.cityList.push(
            {
              label :city.name,
              value :city._id
            }
          )
        })
        this.basicInfo.get("city").patchValue(this.basicDetails.in_location.city)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const villageList = result.body.list;
        villageList.map((village)=>{
          this.villageList.push(
            {
              label :village.name,
              value :village._id
            }
          )
        })
        this.basicInfo.get("village").patchValue(this.basicDetails.in_location.village)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get f() {
    return this.basicInfo.controls;
  }
  removeSelectpic(data: any) {
    if (data === "profileImage") {
      this.profileImage = "";
    }
    else if(data === "license_picture") {
      this.license_picture = "";
    }

  }
  getAllTitle() {
    this.individualDoctorService.getAllTitle().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        const titleList = response?.body?.list
        titleList.map((title)=>{
          this.titleList.push(
            {
              label : title.title,
              value  : title._id
            }
          )
        })
       this.basicInfo.get("title").patchValue(this.basicDetails.title)
      }

    });
  }
  getAllDesignation() {
    this.individualDoctorService.getAllDesignation().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        const deginationList = response?.body?.list
        deginationList.map((designation)=>{
          this.deginationList.push(
            {
              label : designation.designation,
              value  : designation._id
            }
          )
        })
       this.basicInfo.get("designation").patchValue(this.basicDetails.designation)

      }

    });
  }
 
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.basicInfo.value.language;
  }

  onSpecialityChange(event:any): void {
    this.selectedSpecialities = this.basicInfo.value.speciality;
  }
  

  fileChange(event) {
   
    
    /*    let fileList: FileList = event.target.files;
       if (fileList.length > 0) {
         let file: File = fileList[0];
         this.selectedFiles = file;
         console.log(event,"selectedTesttt______",this.selectedFiles);
       } */
   
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
     
           // 'excelData' now holds the data from the Excel file
           // Use this data to display in your table or manipulate as needed
   
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
             console.log(this.allTestsList, 'excelDataaaaaa____', excelData);
           } else {
             this.isColumnNameCorrect = false;
             this.toastr.error("Incorrect column Names","Error")
             console.log('Incorrect column headings. Expected: "Type Of Test" and "Name Of Test"');
             // Handle the error or adjust as needed
           }
           //console.log(this.allTestsList,"excelDataaaaaa____",excelData);
         };
     
         reader.readAsArrayBuffer(file);
       }
   
     }

  closePopup() {
      this.modalService.dismissAll("close");
      this.manualForm.reset();
      this.isSubmitted1 = false;
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

  excleSubmit(){

    console.log("doneee_________");
    
    this.isSubmitted1 = true;
    if (this.testExcelForm.invalid) {
      console.log("Invaliddd_______");
      this.toastr.error("Please select the excel","Error")
      return;
    }
    if(!this.isColumnNameCorrect){
      this.toastr.error("Incorrect column Names","Error")
    }
  }

  removeTest(){
    this.loader.start();
    this.service.deletePathologyTest(this.deleteTestData).subscribe((res:any)=>{
     let response = this.coreService.decryptObjectData({ data: res });
     if(response.status == true){
      this.loader.stop();
       this.toastr.success(response.message,"Success")
       this.allTestsList.splice(this.deleteTestIndex, 1);
       this.closePopup();
       console.log(response,"responseeee______");
     }else{
      this.loader.stop();
     }
    })
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
 
  openVerticallyCenteredaddmanually(addmanualcontent: any) {
    this.modalService.open(addmanualcontent, {
      centered: true,
      size: "md",
      windowClass: "add_role",
    });
  }

  newManualEntryForm(): FormGroup {
    return this.fb.group({
      typeOfTest: ["",[Validators.required]],
      nameOfTest: ["",[Validators.required]],
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
      added_by: this.doctorId
    };
    console.log("REQUEST DATA===>", reqData);
    this.individualDoctorService.addManualTestss(reqData).subscribe(
      (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        console.log(result);
        if (result.status) {
          this.loader.stop();
          this.coreService.showSuccess(result.message, "");
          this.manualForm.markAsUntouched(); 
          this.manualForm.reset(); 
          this.closePopup();
          this.getDoctorDetailsForLabTest();
        }else{
          this.loader.stop();
          this.coreService.showError("",result?.message)
        }
      },
      (error) => {
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
      this.coreService.showError("Please enter all fields", "");
      return
    }
    this.isSubmitted = false;
    let formValues = this.editmanualForm.value;
    this.loader.start();
    let dataToPass = {
      id: this.testIdForUpdate,
      typeOfTest: formValues.typeOfTest,
      nameOfTest: formValues.nameOfTest,
      loggedInId: this.doctorId
    };
    console.log(dataToPass);

    this.individualDoctorService.editTests(dataToPass).subscribe((res: any) => {
      let DecryptResponse = this.coreService.decryptObjectData({ data: res });

      if (DecryptResponse.status == true) {
        this.loader.stop();
        this.coreService.showSuccess("",DecryptResponse?.message);
        this.getDoctorDetailsForLabTest();
        this.modalService.dismissAll("Closed");
        this.editmanualForm.reset();
        // this.roleList();
      }else{
        this.loader.stop();
        this.coreService.showError("",DecryptResponse?.message)
      }
    });
  }
  
  onstaffChange(event: any): void {
    this.selectedStaff = this.basicInfo.value.assignStaff;
  }
}
