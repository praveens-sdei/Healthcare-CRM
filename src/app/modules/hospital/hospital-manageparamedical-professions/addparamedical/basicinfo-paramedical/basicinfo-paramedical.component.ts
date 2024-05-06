import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import intlTelInput from "intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { HospitalService } from "../../../../hospital/hospital.service";
import { SuperAdminService } from "../../../../super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { IndiviualDoctorService } from "../../../../individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../../../four-portal/four-portal.service";
import { MatStepper } from "@angular/material/stepper";
import Validation from "src/app/utility/validation";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from "xlsx";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-basicinfo-paramedical",
  templateUrl: "./basicinfo-paramedical.component.html",
  styleUrls: ["./basicinfo-paramedical.component.scss"],
})
export class BasicinfoParamedicalComponent implements OnInit {
  @Output() fromChild = new EventEmitter<string>();
  teams = new FormControl("");
  teamList: string[] = ["Team1", "Team2", "Team3", "Team4"];
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
  selectedCountryCode: any = '+226';

  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};

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

  stepper: any;
  id: any;
  overlay: false;
  doctor_id: any;
  langId: any;
  village_id: any;
  speciality_id: any;
  experties_id: any;
  nationalityselected: any = "";
  regionselected: any;
  staffselected: any=[];
  license_picture: any = null;
  titleList: any[] = [];
  deginationList:any = [];
  team_List: any[] = [];
  service_department_unit_Response: any;
  license_picture_: any;
  selectedLanguages: any = [];
  selectedcountrycodedb: any = "";
  allTestsList: any = [];
  deleteTestData: any = {};
  isColumnNameCorrect: boolean = false;
  isSubmitted1: boolean = false;
  countryCodes: string[];
  patchCountry: any;
  selectedSpecialities: any=[];
  manualForm: FormGroup;
  editmanualForm: FormGroup;
  testIdForUpdate: any;
  selectedspecialitiesname: any=[];
  selectedStaff: any=[];
  hide1 = true;
  hide2 = true;
  constructor(
    private toastr: ToastrService,
    private service: HospitalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private fourportalservice: FourPortalService,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService
  ) {
    this.basicInfo = this.fb.group(
      {
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
        mobile: ["", [Validators.required]],
        dob: ["", [Validators.required]],
        date_of_join: [""],
        designation: ["", [Validators.required]],
        title: ["", [Validators.required]],
        experience: ["", [Validators.required]],
        // assignDoctor: ["", [Validators.required]],
        assignStaff: [""],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ],
        ],
        gender: ["", [Validators.required]],
        language: [""],
        userName: [""],
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
        confirm_password: [null, [Validators.required]],
        urgent_care_service: [false, [Validators.required]],
        aboutDoctor: [""],

        license_details: this.fb.group({
          license_number: ["", [Validators.required]],
          license_expiry_date: ["", [Validators.required]],
          license_picture: [""],
        }),

        team: [""],
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
        appointment_accepted: this.fb.group({
          online: [false],
          homevisit: [false],
          hospitalvisit: [false],
        }),

        medicine_request: this.fb.group({
          prescription_order: [false],
          homevmedicine_price_requestsit: [false],
          request_medicine_available: [false],
        }),
        mobilePayDetails: this.fb.array([]),
      },
      { validators: [Validation.match("password", "confirm_password")] }
    );
    this.countryCodes = [
      "+226(BF)",
      "+229(BJ)",
      "+225(CI)",
      "+223(ML)",
      "+221(SN)",
      "+228(TG)",
    ];

    this.manualForm = this.fb.group({
      manualentries: this.fb.array([]),
    });

    this.editmanualForm = this.fb.group({
      typeOfTest: ["", [Validators.required]],
      nameOfTest: ["", [Validators.required]]
    });
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  getCountryCode() {
    var country_code = "BF";
    console.log("PATCH DATA====>1", this.selectedcountrycodedb);
    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (
        countryData[i].dialCode === this.selectedcountrycodedb.split("+")[1]
      ) {
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
  }

  ngAfterViewInit() {
    if(this.doctorId===""){
      this.getCountryCode();
    }

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
    // sessionStorage.setItem('doctorId',"63da369f7ced1fdc6988da2b")
    // this.toppings.setValue(['Pepperoni', 'Sausage', 'Tomato']);
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    if (paramId === null) {
      this.pageForAdd = true;
      // this.addNewMedAct();
      // this.addNewLabTest();
      // this.addNewImg();
      // this.addNewVac();
      // this.addOtherTest();
      this.addMobPay();
      this.stepper = this.mstepper;
      this.getCountryList();
    } else {
      this.pageForAdd = false;
      this.doctorId = paramId;
      sessionStorage.setItem("doctorId", paramId);
      this.getDoctorDetails(this.mstepper);
      console.log("gjhdghjdhdkkdjl", this.mstepper);

      this.getCountryList("edit");

      this.basicInfo.get("password").clearValidators();
      this.basicInfo.get("confirm_password").clearValidators();
    }
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.hospitalId = loginData?._id;
    this.getSpokenLanguage();

    this.getDepartments();
    this.getServices("");
    this.getUnits("");
    this.getExperties();
    this.getSpecialities();

    this.getDoctorList();
    this.getStaffList();
    this.getAllDesignation();
    this.getAllTitle();
    this.getAllTeam();
    this.addnewRntry();
  }

  testExcelForm: FormGroup = new FormGroup({
    specialization_csv: new FormControl("", [Validators.required]),
  });

  locationData: any;

  getDoctorDetails(fromParent: any) {
    let response = fromParent?.response;
    this.stepper = fromParent?.mainStepper;
    console.log("GET DOCTOR DETAILS BASIC INFO=======>", response);

    if (response.data.pathology_tests.length > 0) {
      this.allTestsList = response.data.pathology_tests;
      console.log(this.allTestsList, "allTestsListtt_____");
    } else {
      this.allTestsList = [];
    }

    this.profileDetails = response?.data?.result[0];
    console.log("GET DOCTOR DETAILS BASIC INFO=======>", this.profileDetails);

    this.profileImage = this.profileDetails?.profile_picture?.url;
    this.license_picture_ = this.profileDetails?.license_details?.image_url;
    console.log("this.licenseFile", this.licenseFile);

    this.locationData = this.profileDetails?.in_location;
    console.log(this.locationData, "nationalityselected");

    if (this.countryList.length > 0 || this.regionList.length > 0) {
      console.log("testtt");
      this.patchValues(this.profileDetails);
    }
  }

  //-----------patch values---------
  patchValues(data: any) {
    console.log("data-->patchvalue", data);

    if (data?.in_mobile_pay) {
      data?.in_mobile_pay?.mobilePay.forEach((element) => {
        this.addMobPay();
      });
    } else {
      this.addMobPay();
    }
    this.basicInfo.patchValue({
      ...data,
      ...data?.in_location,
      ...data?.for_portal_user,
      experience: data?.years_of_experience,
      language: data?.spoken_language,
      aboutDoctor: data?.about,
      license_details: {
        license_number: data?.license_details?.license_number,
        license_expiry_date: data?.license_details?.license_expiry_date,
      },
      bank_details: data?.in_bank,
      mobilePayDetails: data?.in_mobile_pay?.mobilePay,
      // assignDoctor: data?.assign_staff[0]?._id,
      speciality: data?.speciality,
      departmentt: data?.department,
      service: data?.services,
      unit: data?.unit,
      expertise: data?.expertise,
      nationality: data?.in_location?.country,
      urgent_care_service: data?.urgent_care_service,
      assignStaff:data?.assign_staff
    });
    // this.staffselected = data?.assign_staff[0]?._id;
    for(let data1 of data?.assign_staff){
      this.staffselected.push(data1?._id)
    }
    this.getServiceDepartmentUnit(data?.department?._id, "selected");
    this.selectedcountrycodedb = data?.for_portal_user?.country_code
    this.getCountryCode();
  }

  //For Add Doctor
  async handleSaveBasicInfo() {
    const invalid = [];
    const controls = this.basicInfo.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    // console.log(invalid);
    this.isSubmitted = true;
    if (this.basicInfo.invalid) {
      const firstInvalidField = document.querySelector(
        "input.ng-invalid, input.ng-invalid"
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: "smooth" });
      }
      this.coreService.showError("", "Please fill all required fields.");
      return;
    }
    this.isSubmitted = false;
    if (this.licenseFile) {
      console.log(this.licenseFile, "this.licenseFile");

      await this.uploadDocument(this.licenseFile).then((res: any) => {
        console.log("res");
        this.license_picture_ = res.data[0];

        this.basicInfo.patchValue({
          license_details: {
            license_picture: res.data[0],
          },
        });
        // this.coreService.showSuccess("", res.message);
      });
    }

    if (this.profileImageFile) {
      await this.uploadDocument(this.profileImageFile).then((res: any) => {
        this.basicInfo.patchValue({
          profilePicture: res.data[0],
        });
        // this.coreService.showSuccess("", res.message);
      });
    }

    let data = this.basicInfo.value;

    this.loader.start();
    var reqData = {
      doctor_profile_object_id: data?.profilePicture,
      first_name: data?.first_name,
      middle_name: data?.middle_name,
      last_name: data?.last_name,
      address: data?.address,
      loc: data?.loc,
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
      // assign_staff: data?.assignStaff,
      assign_staff:this.selectedStaff,
      email: data?.email,
      gender: data?.gender,
      spoken_language: this.selectedLanguages,
      password: data?.password,
      urgent_care_service: data?.urgent_care_service,
      about: data?.aboutDoctor,
      license_number: data?.license_details?.license_number,
      license_expiry_date: data?.license_details?.license_expiry_date,
      license_image_object_id: data?.license_details?.license_picture,
      team: data?.team ? data?.team : null,
      speciality:this.selectedSpecialities,
      speciality_name:this.selectedspecialitiesname,
      // services: this.services.value,
      services: data?.service,
      // department: this.departments.value,
      department: data?.departmentt ?  data?.departmentt : null,
      // unit: this.units.value,
      unit: data?.unit,
      // expertise: this.experties.value,
      expertise: data?.expertise,
      pathologyInfo: this.allTestsList,
      bank_name: data?.bank_details?.bank_name,
      account_holder_name: data?.bank_details?.account_holder_name,
      account_number: data?.bank_details?.account_number,
      ifsc_code: data?.bank_details?.ifsc_code,
      bank_address: data?.bank_details?.bank_address,
      mobile_pay_details: data?.mobilePayDetails,
      appointment_accepted: data?.appointment_accepted,
      for_hospital: "",
      id: "",
      type: "Paramedical-Professions",
    };

    if (this.pageForAdd) {
      reqData.for_hospital = this.hospitalId;
    } else {
      reqData.id = this.doctorId;
    }

    console.log("REQUEST DATA <<<<<<<<<======>", reqData);

    this.fourportalservice.createProfile(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        // console.log("ADD DOCTOR RESPONSE=======>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          sessionStorage.setItem("doctorId", response?.data?.portal_user_id);
          if (this.pageForAdd) {
            this.fromChild.emit("basicInfo");
          } else {
            this.stepper.next();
          }
        } else {
          this.loader.stop();
          this.coreService.showError("", response?.message);
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  onFileSelected(event, type: "profile" | "license") {
    let file = event.target.files[0];
    console.log("file-->", file);

    const formData: FormData = new FormData();
    formData.append("portal_user_id", this.hospitalId);
    formData.append("docType", type);
    // formData.append("multiple", "false");
    formData.append("documents", file);
    formData.append("portalType", "Paramedical-Professions");

    if (type === "license") {
      this.licenseFile = formData;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.license_picture_ = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);

      console.log("file-->", this.licenseFile);
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
      this.fourportalservice.uploadFileForPortal(doc).subscribe(
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
      pay_number: [""],
      mobile_country_code: [this.countryCodes[0]],
    });
    this.mobilePayDetails.push(addMobPay);
  }

  removeMobPay(index: number) {
    this.mobilePayDetails.removeAt(index);
  }
  //----------------------------------------------------------------------------DEPART>SERVICE>UNIT
  departmentListt: any[] = [];
  servicesListt: any[] = [];
  unitListt: any[] = [];
  expertiesListt: any[] = [];
  specialityListt: any[] = [];

  doctorList: any[] = [];
  staffList: any[] = [];

  assignDoctorId: boolean = false;

  getassignDoctorId(event: any) {
    this.doctor_id = event.value;
    if (this.doctor_id) {
      this.assignDoctorId = true;
    }
  }

  getDoctorList() {
    let reqData = {
      page: 1,
      limit: 10000,
      hospital_portal_id: this.hospitalId,
      searchText: "",
    };
    this.service.getDoctorsList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("DOCTOR LIST==========>", response?.data?.data);
      // this.doctorList = response?.data?.data;
      const arr = response?.data?.data;

      arr.map((curentval: any) => {
        this.doctorList.push({
          label: curentval?.full_name,
          value: curentval?._id,
        });
      });
      // console.log("DOCTOR LIST==========>",   this.doctorList);
    });
  }

  staffId: boolean = false;

  getstaffId(event: any) {
    this.id = event.value;
    if (this.id) {
      this.staffId = true;
    }
  }
  getStaffList() {
    let reqData = {
      hospitalId: this.hospitalId,
      limit: 100000,
      page: 1,
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
          value: curentval?.profileinfos?._id,
        });
      });
      
      this.basicInfo.patchValue({
        assignStaff: this.staffselected
       })
    });
  }

  getDepartments() {
    let reqData = {
      added_by: this.hospitalId,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this.service.getAllDepartment(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.departmentListt = response?.body?.data;

      const arr = response?.body?.data;

      arr.map((curentval: any) => {
        this.departmentListt.push({
          label: curentval?.department,
          value: curentval?._id,
        });
      });
      this.basicInfo.patchValue({
        department: this.profileDetails?.department,
      });
    });
  }

  // handleSelectDepartment(event: any) {
  //   this.getServices(event);
  // }

  getServices(departmenttId: any, type = "") {
    if (departmenttId != undefined) {
      let reqData = {
        added_by: this.hospitalId,
        for_department: departmenttId,
      };
      this.servicesListt = [];

      this.service.getAllServices(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        // this.servicesListt = response?.body?.data;
        const arr = response?.body?.data;
        console.log(arr, "arr--->");

        arr.map((curentval: any) => {
          this.servicesListt.push({
            label: curentval?.service,
            value: curentval?._id,
          });
        });
        console.log("this.profileDetails?.unit", this.profileDetails);
        if (type == "service") {
          this.getUnits(this.service_department_unit_Response, "unit");
        } else if (this.profileDetails?.department != departmenttId) {
          this.basicInfo.patchValue({
            service: "",
          });
        } else {
          this.basicInfo.patchValue({
            service: this.profileDetails?.services,
          });
        }
      });
    }
  }

  // handleSelectService(event: any) {
  //   this.getUnits(event);
  //   this.getServiceDepartmentUnit(event, "service");
  // }

  getUnits(serviceId: any, type = "") {
    if (serviceId != undefined) {
      let reqData = {
        added_by: this.hospitalId,
        for_service: serviceId,
      };
      this.unitListt = [];
      this.service.getAllUnits(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        const arr = response?.body?.data;

        arr.map((curentval: any) => {
          this.unitListt.push({
            label: curentval?.unit,
            value: curentval?._id,
          });
        });
        console.log(
          "this.profileDetails?.unit",
          this.profileDetails?.unit,
          this.locationData?.village
        );

        if (type == "unit") {
          this.patchValues(this.profileDetails);
        } else if (this.profileDetails?.services != serviceId) {
          this.basicInfo.patchValue({
            unit: "",
          });
        } else {
          this.basicInfo.patchValue({
            unit: this.profileDetails?.unit,
          });
        }
      });
    }
  }

  handleSelectUnit(event: any) {
    this.getServiceDepartmentUnit(event, "unit");
  }

  expertiesId: boolean = false;

  getExpertiesId(event: any) {
    this.experties_id = event.value;
    if (this.experties_id) {
      this.expertiesId = true;
    }
  }
  getExperties() {
    this.service.getAllExperties(this.hospitalId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.expertiesListt = response?.body?.data;
      const arr = response?.body?.data;

      arr.map((curentval: any) => {
        this.expertiesListt.push({
          label: curentval?.expertise,
          value: curentval?._id,
        });
      });
      this.basicInfo.patchValue({
        expertise: this.profileDetails?.expertise,
      });
      console.log("expertiesListt==========>", this.profileDetails?.expertise);
    });
  }

  specialityId: boolean = false;

  getspecialityId(event: any) {
    this.speciality_id = event.value;
    if (this.speciality_id) {
      this.specialityId = true;
    }
  }

  getSpecialities() {
    this.service.getAllSpeciality().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.specialityListt = response?.body?.data;
      // console.log("specialityListt==========>",   this.specialityListt);

      const arr = response?.body?.data;

      arr.map((curentval: any) => {
        this.specialityListt.push({
          label: curentval?.specilization,
          value: curentval?._id,
        });
      });
      this.basicInfo.patchValue({
        speciality: this.profileDetails?.speciality,
      });
      // console.log("specialityListt==========>",   this.specialityListt);
    });
  }

  getServiceDepartmentUnit(id: any, type: any) {
    let reqData = {
      inputType: type,
      inputValue: [id],
      added_by: this.hospitalId,
    };

    this.service.getServiceDepartmentUnit(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("response", response?.body);
      this.service_department_unit_Response = response?.body;
      if (type === "selected") {
        this.basicInfo.patchValue({
          departmentt: this.profileDetails?.department,
        });
      }
      // if (type === "unit") {
      //   this.basicInfo.patchValue({
      //     departmentt: response?.body?.departmentDetails[0]?._id,
      //     service: response?.body?.serviceDetails[0]?._id,
      //   });
      // }

      // if (type === "service") {
      //   this.basicInfo.patchValue({
      //     departmentt: response?.body?.departmentDetails[0]?._id,
      //   });
      // }
    });
  }

  //------------address component api's-------------
  spokenlang: boolean = false;
  city: boolean = false;
  village: boolean = false;

  getLangId(event: any) {
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
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log(" this.spokenLanguages", response?.body);
      // this.spokenLanguages=response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;

      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });
      this.basicInfo.patchValue({
        language: this.profileDetails?.spoken_language,
      });
      // console.log(" this.spokenLanguages", this.spokenLanguages);
    });
  }

  getCountryList(type = "") {
    this.countryList = [];

    console.log("nationalityselected1", this.countryList);
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // this.countryList = result.body?.list;
        const arr = result.body?.list;

        arr.map((curentval: any) => {
          this.countryList.push({
            label: curentval?.name,
            value: curentval?._id,
          });
        });
        let data =result.body?.list.map((ele)=>{
          if(ele.name === "Burkina Faso"){
            this.patchCountry = ele._id;
          }
        })
        if(this.patchCountry!='')
        {
          this.getRegionList(this.patchCountry);
        }
        console.log("nationalityselected11", this.countryList);

        if (type == "edit") {
          this.getDoctorDetails(this.mstepper);
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

  getRegionList(countryID: any, type = "") {
    console.log("nationalityselectedgetRegionList", countryID, type);

    if (countryID != undefined) {
      this.regionList = [];
      this.sadminService.getRegionListByCountryId(countryID).subscribe({
        next: (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
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

            this.getProvienceList(this.locationData?.region, "edit");
          } else {
            if (this.locationData?.country != countryID) {
              this.basicInfo.patchValue({
                region: "",
              });
            } else {
              this.basicInfo.patchValue({
                region: this.locationData?.region,
              });
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getProvienceList(regionID: any, type = "") {
    if (regionID != undefined) {
      this.provienceList = [];
      this.sadminService.getProvinceListByRegionId(regionID).subscribe({
        next: (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
          // this.provienceList = result.body?.list;
          const arr = result.body?.list;

          arr.map((curentval: any) => {
            this.provienceList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });
          if (type == "edit") {
            this.getDepartmentList(this.locationData?.province, "edit");
          } else {
            if (this.locationData?.region != regionID) {
              this.basicInfo.patchValue({
                province: "",
              });
            } else {
              this.basicInfo.patchValue({
                province: this.locationData?.province,
              });
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getDepartmentList(provinceID: any, type = "") {
    if (provinceID != undefined) {
      this.departmentList = [];
      this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
        next: (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
          // this.departmentList = result.body?.list;
          const arr = result.body?.list;

          arr.map((curentval: any) => {
            this.departmentList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });
          if (type == "edit") {
            this.getCityList(this.locationData?.department, "edit");
          } else {
            if (this.locationData?.province != provinceID) {
              this.basicInfo.patchValue({
                department: "",
              });
            } else {
              this.basicInfo.patchValue({
                provinceID: this.locationData?.provinceID,
              });
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getCityList(departmentID: any, type = "") {
    console.log("getCityIdgetCityId", departmentID);

    if (departmentID != undefined) {
      this.cityList = [];
      this.villageList = [];

      this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
        next: (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
          // this.cityList = result.body?.list;
          const arr = result.body?.list;

          arr.map((curentval: any) => {
            this.cityList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });

          this.sadminService
            .getVillageListByDepartmentId(departmentID)
            .subscribe({
              next: (res) => {
                let result = this.coreService.decryptObjectData({ data: res });
                // this.villageList = result.body?.list;
                const arr = result.body?.list;

                arr.map((curentval: any) => {
                  this.villageList.push({
                    label: curentval?.name,
                    value: curentval?._id,
                  });
                });
                if (type == "edit") {
                  // this.patchValues(this.profileDetails);
                  this.basicInfo.patchValue({
                    city: this.locationData?.city,
                    village: this.locationData?.village,
                    department: this.locationData?.department,
                    province:this.locationData?.province,
                    region:this.locationData?.region,
                    pincode: this.locationData?.pincode,
                  });
                } else {
                  if (this.locationData?.department != departmentID) {
                    this.basicInfo.patchValue({
                      city: "",
                      village: "",
                    });
                  } else {
                    this.basicInfo.patchValue({
                      city: this.locationData?.city,
                      village: this.locationData?.village,
                    });
                  }
                }
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
    }
  }

  get f() {
    return this.basicInfo.controls;
  }
  removeSelectpic(index: any) {
    console.log("index-->", index);

    if (index === "profileImage") {
      this.profileImage = "";
    } else if (index === "license_picture_") {
      this.license_picture_ = "";
    }
  }
  getAllTitle() {
    this.service.getAllTitle().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("title-->", response);

      if (response.status) {
        const titleList = response?.body?.list
        titleList.map((title)=>{
         this.titleList.push(
          {
            label : title.title,
            value : title._id
          }
         )
        })        
        this.basicInfo.get("title").patchValue(this.profileDetails.title)
      }
    });
  }
  getAllDesignation() {
    this.service.getAllDesignation().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      if (response.status) {
        const deginationList = response?.body?.list
        deginationList.map((designation)=>{
          this.deginationList.push(
            {
              label : designation.designation,
              value : designation._id
            }
          )
        }) 
       this.basicInfo.get("designation").patchValue(this.profileDetails.designation)
        
      }
    });
  }
  getAllTeam() {
    this.service.getAllTeam(this.hospitalId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("response--->", response);

      if (response.status) {
        const team_List = response?.body?.list
        team_List.map((teamList)=>{
          this.team_List.push(
            {
              label : teamList.team,
              value : teamList._id
            }
          )
        })
       this.basicInfo.get("team").patchValue(this.profileDetails.team)
      }
    });
  }

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.basicInfo.value.language;
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted1 = false;
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
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming you're reading the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to an array of objects
        const excelData = XLSX.utils.sheet_to_json(sheet);

        // 'excelData' now holds the data from the Excel file
        // Use this data to display in your table or manipulate as needed

        const firstRow = excelData[0]; // Get the first row assuming it contains column headers

        const expectedHeaders = ["Type Of Test", "Name Of Test"];

        if (
          firstRow.hasOwnProperty(expectedHeaders[0]) &&
          firstRow.hasOwnProperty(expectedHeaders[1])
        ) {
          this.isColumnNameCorrect = true;
          // Column headers are as expected
          console.log("Column headings are correct for both columns");
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
          console.log(this.allTestsList, "excelDataaaaaa____", excelData);
        } else {
          this.isColumnNameCorrect = false;
          this.toastr.error("Incorrect column Names", "Error");
          console.log(
            'Incorrect column headings. Expected: "Type Of Test" and "Name Of Test"'
          );
          // Handle the error or adjust as needed
        }
        //console.log(this.allTestsList,"excelDataaaaaa____",excelData);
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
    console.log("doneee_________");

    this.isSubmitted1 = true;
    if (this.testExcelForm.invalid) {
      console.log("Invaliddd_______");
      this.toastr.error("Please select the excel", "Error");
      return;
    }
    if (!this.isColumnNameCorrect) {
      this.toastr.error("Incorrect column Names", "Error");
    }
  }

  removeTest() {
    this.loader.start();
    this.fourportalservice
      .deletePathologyTest(this.deleteTestData)
      .subscribe((res: any) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if(response.status == true){
          this.loader.stop();
          this.toastr.success(response.message, "Success");
          this.allTestsList.splice(this.deleteTestIndex, 1);
          this.closePopup();
          console.log(response, "responseeee______");
        }
      });
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

  onSpecialityChange(event:any): void {
    this.selectedSpecialities = this.basicInfo.value.speciality;

    event?.options.forEach(item => {
      if (!this.selectedspecialitiesname.includes(item.label)) {
        this.selectedspecialitiesname.push(item.label);
      }
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
      isExist: false
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
    console.log(this.manualForm.value.manualentries,"labsss_____");
    this.allTestsList = [...this.manualForm.value.manualentries,...this.allTestsList];
    this.closePopup();
   
  }
  
  getDoctorDetailsForLabTest() {
    let reqData = {
      portal_user_id: this.doctorId,
      type: 'Paramedical-Professions'
    }
    this.fourportalservice.getProfileDetailsById(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.data.pathology_tests.length > 0) {
          this.allTestsList = response.data.pathology_tests;
          console.log(this.allTestsList, "allTestsListtt_____");
        } else {
          this.allTestsList = [];
        }
      }, err => {
        let errResponse = this.coreService.decryptObjectData({ data: err.error })
        this.toastr.error(errResponse.message)
      });
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
    this.loader.start();
    this.isSubmitted = false;
    let formValues = this.editmanualForm.value;
    let dataToPass = {
      id: this.testIdForUpdate,
      typeOfTest: formValues.typeOfTest,
      nameOfTest: formValues.nameOfTest,
      loggedInId: this.doctorId,
      type:'Paramedical-Professions'
    };
    console.log(dataToPass);

    this.fourportalservice.editTests(dataToPass).subscribe((res: any) => {
      let DecryptResponse = this.coreService.decryptObjectData({ data: res });

      if (DecryptResponse.status == true) {
        this.loader.stop();
        this.coreService.showSuccess("", DecryptResponse?.message);
        this.getDoctorDetailsForLabTest();
        this.modalService.dismissAll("Closed");
        this.editmanualForm.reset();
        // this.roleList();
      } else {
        this.loader.stop();
        this.coreService.showError("", DecryptResponse?.message)
      }
    });
  }

  onstaffChange(event: any): void {
    this.selectedStaff = this.basicInfo.value.assignStaff;
  }
}
