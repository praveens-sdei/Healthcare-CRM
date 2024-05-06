import { PatientService } from "src/app/modules/patient/patient.service";
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { StepperOrientation } from "@angular/cdk/stepper";
import { BreakpointObserver } from "@angular/cdk/layout";
import { map, Observable } from "rxjs";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { distinctUntilChanged, EMPTY, startWith, switchMap, tap } from "rxjs";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { promises } from "dns";
import { DatePipe } from "@angular/common";
import { InsuranceSubscriber } from "src/app/modules/insurance/insurance-subscriber.service";
import Validation from "src/app/utility/validation";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import intlTelInput from "intl-tel-input";
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: "app-addpatient",
  templateUrl: "./addpatient.component.html",
  styleUrls: ["./addpatient.component.scss"],
  encapsulation: ViewEncapsulation.None,
  exportAs: "mainStepper",
})
export class AddpatientComponent implements OnInit {
  displayedColumnsDocs: string[] = [
    "Document",
    "issue date",
    "expiry date",
    "action",
  ];

  @ViewChild("mainStepper") mainStepper: MatStepper;

  stepperOrientation: Observable<StepperOrientation>;
  @ViewChild("delete_Immunization") delete_Immunization: ElementRef;
  @ViewChild("insurancenotfound") insurancenotfound: ElementRef;
  @ViewChild("stepper") private myStepper: MatStepper;

  personalDetails!: FormGroup;
  insuranceDetails: any = FormGroup;
  addVitals!: FormGroup;
  medicine!: FormGroup;
  immunizationForm!: FormGroup;
  historyForm!: FormGroup;
  medicalDocumentForm!: FormGroup;
  familyMembersForm!: FormGroup;
  patient_id: any;
  isSubmitted: any = false;
  showAddressComponent: any = false;

  genderList: any[] = [];
  bloodGroupList: any[] = [];
  martialStatusList: any[] = [];
  spokenLanguageList: any[] = [];
  relationshipList: any[] = [];
  immunizationList: any[] = [];
  patientHistoryTypeList: any[] = [];
  allergyList: any[] = [];
  lifestyleList: any[] = [];
  familyHistoryTypeList: any[] = [];

  selectedTabIndex: number = 0;

  doctorId: any = "";
  isUpdating: boolean = false;
  actualsubscriberId: any = ""
  isPersonalDetails: boolean = false;
  isInsurance: boolean = false;
  isVitals: boolean = false;
  isMedicines: boolean = false;
  isImmunization: boolean = false;
  isHistory: boolean = false;
  isMedDocs: boolean = false;
  isFamily: boolean = false;

  setDocToView: any = "";
  maxDOB: any;
  iti: any;
  selectedCountryCode: any = "+226";
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  selectImmunization: any = [];
  imunizationData :any[]= [];


  selectImmunization_id: any = [];
  requiredDeleteData: any;
  existing_id: any;
  deleteIndex: any;
  deleted_id: any;

  @ViewChild("mobile") mobile: ElementRef<HTMLInputElement>;
  height: any;
  BMIUpadteValue: number;
  weight: number;

  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    breakpointObserver: BreakpointObserver,
    private route: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private insuranceSubscriber: InsuranceSubscriber,
    private doctorService: IndiviualDoctorService,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe("(min-width: 1200px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));

    this.personalDetails = this.fb.group(
      {
        first_name: ["", [Validators.required]],
        middle_name: [""],
        last_name: ["", [Validators.required]],
        gender: ["", [Validators.required]],
        dob: [""],
        age: [0],
        spokenLanguage: [""],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ],
        ],
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
            // [Validators.required,
            //   /* Validators.pattern(/^-?(0|[1-9]\d*)?$/) */],
          ],
        }),
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
        confirm_password: [null, Validators.compose([Validators.required])],
      },
      { validators: [Validation.match("password", "confirm_password")] }
    );

    this.insuranceDetails = this.fb.group({
      insurance_id: ["", [Validators.required]],
      firstName: [""],
      lastName: [""],
      mobile: [""],
      dob: [""],
    });

    this.addVitals = this.fb.group({
      height: ["", [Validators.required]],
      weight: ["", [Validators.required]],
      h_rate: ["", [Validators.required]],
      bmi: ["", [Validators.required]],
      bp: ["", [Validators.required]],
      pulse: ["", [Validators.required]],
      resp: ["", [Validators.required]],
      temp: ["", [Validators.required]],
      blood_group: ["", [Validators.required]],
      clearance: ["", [Validators.required]],
      hepatics_summary: ["", [Validators.required]],
    });

    this.medicine = this.fb.group({
      current_medicines: this.fb.array([]),
      past_medicines: this.fb.array([]),
    });

    this.immunizationForm = this.fb.group({
      immunization: this.fb.array([]),
    });

    this.historyForm = this.fb.group({
      patient_history: this.fb.array([]),
      allergies: this.fb.array([]),
      lifestyle: this.fb.array([]),
      familial_history: this.fb.array([]),
    });

    this.medicalDocumentForm = this.fb.group({
      medical_document: this.fb.array([]),
    });

    this.familyMembersForm = this.fb.group({
      family_members: this.fb.array([]),
      medical_history: this.fb.array([]),
      social_history: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    this.maxDOB = d;
    let patientId = this.activatedRoute.snapshot.paramMap.get("id");
    if (patientId) {
      this.patient_id = patientId;
      this.isUpdating = true;
      let tabIndex = parseInt(sessionStorage.getItem("tabIndexForDoctor"));
      this.selectedTabIndex = tabIndex;
      this.getProfileDetails();

      this.personalDetails.get("password").clearValidators(); //disbale password validation for edit
      this.personalDetails.get("confirm_password").clearValidators();
      this.isPersonalDetails = true;
      this.isInsurance = true;
      this.isVitals = true;
      this.isMedicines = true;
      this.isImmunization = true;
      this.isHistory = true;
      this.isMedDocs = true;
      this.isFamily = true;
    } else {
      this.showAddressComponent = true;
    }

    let loginData = this._coreService.getLocalStorage("loginData");
    this.doctorId = loginData?._id;

    this.addNewCurrentMedicine();
    this.addNewPastMedicine();
    this.addNewImmunization();

    this.addNewPatient_History();
    this.addNewAllergies();
    this.addNewLifestyle();
    this.addNewFamilial_history();

    this.addNewFamilyMember();
    this.addNewMedicalHistory();
    this.addNewSocialHistory();

    this.addNewMedicalDocument();

    this.getPatientHistoryTypeList();
    this.getAllAllergies();
    this.getLifestyleList();
    this.getFamilyHistoryType();

    this.getCommonData();
    this.getImmunizationList();

    this.getInsuranceCompanyList();

    this.addVitals.get('height').valueChanges.subscribe(() => {
      this.calculateBMI();
    });

    this.addVitals.get('weight').valueChanges.subscribe(() => {
      this.calculateBMI();
    });
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  ngAfterViewInit() {
    const input = this.mobile.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: "BF",
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;

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

  handlePersonalDetails() {
    this.isSubmitted = true;
    if (this.personalDetails.invalid) {
      console.log("====================INVALID=========================");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      ...this.personalDetails.value,
      patient_id: "",
      added_by_doctor: "",
    };

    if (this.patient_id) {
      reqData.patient_id = this.patient_id;
    } else {
      reqData.added_by_doctor = this.doctorId;
    }

    console.log("REQUEST DATA===>", reqData);

    this.doctorService.addPatientByDoctor(reqData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("RESPONSE===>", response);
        if (response.status) {
          this.loader.stop();
          sessionStorage.setItem(
            "patientAddedId",
            response?.data?.portalUserData?._id
          );
          this.patient_id = response?.data?.portalUserData?._id;
          this.toastr.success(response.message);
          if (!this.isUpdating) {
            this.isPersonalDetails = true;
            this.goNext();
          } else {
            this.goForward();
          }
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      },
      (err) => {
        let errResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  async handleInsuranceDetails() {
    this.isSubmitted = true;
    if (this.insuranceDetails.invalid) {
      console.log("====================INVALID=========================");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    if (this.primaryInsuredFile != null) {
      await this.uploadDocuments(this.primaryInsuredFile).then((res: any) => {
        this.insuranceDetails.patchValue({
          primary_insured: {
            insurance_card_and_id_image: res.data[0].Key,
          },
        });
      });
    }

    if (this.secondaryInsuredFile != null) {
      await this.uploadDocuments(this.secondaryInsuredFile).then((res: any) => {
        this.insuranceDetails.patchValue({
          secondary_insured: {
            insurance_card_and_id_image: res.data[0].Key,
          },
        });
      });
    }

    let reqData = {
      patient_id: this.patient_id,
      ...this.insuranceDetails.value,
    };

    this.service.insuranceDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        if (!this.isUpdating) {
          this.isInsurance = true;
          this.goNext();
        } else {
          this.goForward();
        }
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleAddVitals() {
    this.loader.start();
    let reqData = {
      ...this.addVitals.value,
      patient_id: this.patient_id,
      // doctor_id: this.doctorId,
    };
    this.service.addVitals(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        if (!this.isUpdating) {
          this.isVitals = true;
          this.goNext();
        } else {
          this.goForward();
        }
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleMedicines() {
    this.isSubmitted = true;
    if (
      this.medicine.get("current_medicines").invalid ||
      this.medicine.get("past_medicines").invalid
    ) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = { patient_id: this.patient_id, ...this.medicine.value };
    this.service.medicines(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        if (!this.isUpdating) {
          this.isMedicines = true;
          this.goNext();
        } else {
          this.goForward();
        }
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleImmunization() {
    this.isSubmitted = true;
    if (this.immunizationForm.get("immunization").invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      doctor_id: this.doctorId,
      patient_id: this.patient_id,
      ...this.immunizationForm.value,
    };
    console.log(reqData);
 
    this.service.immunizations(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.selectImmunization = [];
        this.selectImmunization_id = [];
        this.clearFormArray(this.immunization)
        this.patchImmunization(response.body,'immun')
        this.goForward();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  clearFormArray = (formArray: FormArray) => {
    console.log("formArray", formArray.length
    );
    var i = 0;
    while (i < formArray.length) {

      formArray.removeAt(i)
    }
  }
  handlePatientHistory() {
    this.isSubmitted = true;
    if (this.historyForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = { patient_id: this.patient_id, ...this.historyForm.value };
    this.service.patientHistory(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        if (!this.isUpdating) {
          this.isHistory = true;
          this.goNext();
        } else {
          this.goForward();
        }
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleMedicalDocuments() {
    this.isSubmitted = true;
    if (this.medicalDocumentForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      patient_id: this.patient_id,
      ...this.medicalDocumentForm.value,
    };
    console.log("MEDICAL DOC REQUEST===========>", reqData);
    this.service.medicalDocuments(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      console.log(response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        if (!this.isUpdating) {
          this.isMedDocs = true;
          this.goNext();
        } else {
          this.goForward();
        }

        this.getProfileDetails();
        this.resetDocForm();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  resetDocForm() {
    this.medicalDocumentForm.reset();
    this.medical_document.clear();

    this.addNewMedicalDocument();
  }

  handleFamilyDetails() {   
    this.loader.start();
    let reqData = {
      patient_id: this.patient_id,
      ...this.familyMembersForm.value,
    };
    this.service.dependentFamilyMembers(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.route.navigate(["/individual-doctor/patientmanagement"]);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  getProfileDetails() {
    let params = {
      patient_id: this.patient_id,
    };
    this.service.profileDetails(params).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      let profile = response.body;
      console.log("GET ALL DETAILS================>", response);
      this.pathcPersonalDetails({
        profile: response.body?.personalDetails,
        in_location: response.body?.locationDetails,
        portalData: response.body?.portalUserDetails,
      });
      console.log(profile);
      
      this.patchInsuranceDetails(response.body?.insuranceDetails);
      this.patchVitals(response.body?.vitalsDetails);
      this.patchMedicines(response.body?.medicineDetails);
      this.patchImmunization(response.body?.immunizationDetails);
      this.imunizationData=response.body?.immunizationDetails
      this.patchHistory(response.body?.historyDetails);
      this.patchMedicalDocumnets(response.body?.medicalDocument);

      this.patchFamilyMembers(response.body?.familyDetails);
    });
  }

  //-----------------Patch Value Section----------------------------------
  pathcPersonalDetails(data: any) {
    let patientAge = this.calculateAge(data?.profile?.dob);
    this.personalDetails.patchValue({
      ...data?.profile,
      ...data?.profile?.for_portal_user,
      ...data?.in_location,
      ...data?.portalData,
      age: patientAge,
    });
    this.showAddressComponent = true;
  }

  showOtherSearchFields: boolean = true;
  addedInsId: any = "";

  patchInsuranceDetails(insurance: any) {
    if (insurance) {
      console.log("AAYA HAI===>", insurance);
      this.showOtherSearchFields = false;
      this.addedInsId = insurance?.insurance_id;
      this.viewSubscriberDetails(insurance?.primary_subscriber_id);
    } else {
      this.showOtherSearchFields = true;
      console.log("NAHI AAYA HAI===>");
    }

    this.insuranceDetails.patchValue({
      insurance_id: insurance?.insurance_id,
    });
  }

  patchVitals(vitals: any) {
    // this.addVitals.patchValue(vitals[0]);
  }

  patchMedicines(medicines: any) {
    for (let i = 0; i < medicines?.current_medicines.length - 1; i++) {
      this.addNewCurrentMedicine();
    }
    for (let i = 0; i < medicines?.past_medicines.length - 1; i++) {
      this.addNewPastMedicine();
    }
    this.medicine.patchValue(medicines);
  }
  patchImmunization(immunizations: any, type = '') {
    console.log(
      "GET IMMUNIATIONS DETAILS================>",
      immunizations
    );
    for (let i = 0; i <= immunizations?.length - 1; i++) {
      if (i != 0 || type !='') {
        this.addNewImmunization();
      }

      this.selectImmunization.push(immunizations[i].name);
      this.selectImmunization_id.push(immunizations[i]._id);

    }

    this.immunization.patchValue(immunizations);
  }

  patchHistory(history: any) {
    for (let i = 0; i < history?.patient_history.length - 1; i++) {
      this.addNewPatient_History();
    }
    for (let i = 0; i < history?.familial_history.length - 1; i++) {
      this.addNewFamilial_history();
    }
    for (let i = 0; i < history?.allergies.length - 1; i++) {
      this.addNewAllergies();
    }
    for (let i = 0; i < history?.lifestyle.length - 1; i++) {
      this.addNewLifestyle();
    }
    this.historyForm.patchValue(history);
  }

  documentsData: any[] = [];
  patchMedicalDocumnets(docs: any) {
    this.documentsData = docs;
    // for (let i = 0; i < docs?.length - 1; i++) {
    //   this.addNewMedicalDocument();
    // }
    // this.medicalDocumentForm.patchValue({
    //   medical_document: docs,
    // });
  }

  patchFamilyMembers(family: any) {
    console.log("patchFamilyMembers==============>", family);
    for (let i = 0; i < family?.family_members.length - 1; i++) {
      this.addNewFamilyMember();
    }
    for (let i = 0; i < family?.social_history.length - 1; i++) {
      this.addNewSocialHistory();
    }
    for (let i = 0; i < family?.medical_history.length - 1; i++) {
      this.addNewMedicalHistory();
    }
    this.familyMembersForm.patchValue(family);
  }

  primaryInsuredFile: FormData = null;
  secondaryInsuredFile: FormData = null;

  //--------------------------Upload File Section------------------------------
  onFileChange(event: any, file_for: string) {
    let file = event.target.files[0];
    console.log("FILE=============>", file_for, file);
    let formData: any = new FormData();
    formData.append("userId", this.patient_id);
    formData.append("docType", file_for);
    formData.append("multiple", "false");
    formData.append("docName", file);

    if (file_for === "primary_insured") {
      this.primaryInsuredFile = formData;
    } else {
      this.secondaryInsuredFile = formData;
    }
  }

  async onMedicalDocChange(event: any, index: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let formData: any = new FormData();
      formData.append("userId", this.patient_id);
      formData.append("docType", index);
      formData.append("multiple", "false");
      formData.append("docName", file);

      await this.uploadDocuments(formData).then((res: any) => {
        this.medical_document.at(index).patchValue({
          image: res.data[0].Key,
        });
      });
    }
  }

  uploadDocuments(doc: FormData) {
    this.loader.start();
    return new Promise((resolve, reject) => {
      this.service.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData(res);
          resolve(response);
          this.loader.stop();
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this.loader.stop();
          this.toastr.error(errResponse.messgae);
        }
      );
    });
  }

  //-------------------------personal details handling---------------

  get insuranceValidation() {
    return this.insuranceDetails.controls;
  }

  //------------------------Medicine Form Handling--------------------------
  currentMedicineValidation(index) {
    let medicineList = this.medicine.get("current_medicines") as FormArray;
    const formGroup = medicineList.controls[index] as FormGroup;
    return formGroup;
  }

  pastMedicineValidation(index) {
    let medicineList = this.medicine.get("past_medicines") as FormArray;
    const formGroup = medicineList.controls[index] as FormGroup;
    return formGroup;
  }

  get current_medicines() {
    return this.medicine.controls["current_medicines"] as FormArray;
  }

  get past_medicines() {
    return this.medicine.controls["past_medicines"] as FormArray;
  }

  addNewCurrentMedicine() {
    const currentNewMedicineForm = this.fb.group({
      medicine: [""],
      dose: [""],
      frequency: [""],
      strength: [""],
      start_date: [""],
      end_date: [""],
    });
    this.current_medicines.push(currentNewMedicineForm);
  }

  addNewPastMedicine() {
    const pastNewMedicineForm = this.fb.group({
      medicine: [""],
      dose: [""],
      frequency: [""],
      strength: [""],
      start_date: [""],
      end_date: [""],
    });
    this.past_medicines.push(pastNewMedicineForm);
  }

  deleteCurrentMedicine(index: number) {
    this.current_medicines.removeAt(index);
  }

  deletePastMedicine(index: number) {
    this.past_medicines.removeAt(index);
  }

  //-----------------------------Immunization Form Handling-----------------------

  immunizationValidation(index) {
    let immunization = this.immunizationForm.get("immunization") as FormArray;
    const formGroup = immunization.controls[index] as FormGroup;
    return formGroup;
  }

  get immunization() {
    return this.immunizationForm.controls["immunization"] as FormArray;
  }

  addNewImmunization() {
    const newImmunization = this.fb.group({
      _id: [""],
      name: [""],
      manufactured_name: [""],
      medical_centre: [""],
      batch_number: [""],
      next_immunization_appointment: [""],
      administered_date: [""],
      route_of_administered: [""],
      hcp_provided_immunization: [""],
      allow_to_export: [false],
    });
console.log("VIKAS",this.immunization);

    this.immunization.push(newImmunization);
  }

  deleteImmunization(index: number) {
    let existing_id = this.selectImmunization_id[index]
    // api call after api call success then remove
    if (existing_id == undefined) {
      this.immunization.removeAt(index);
    } else {
      this.openVerticallyCentereddetale(this.delete_Immunization, existing_id, index);
    }
  }

  openVerticallyCentereddetale(delete_Immunization: any, existing_id: any, index: any) {
    this.deleted_id = existing_id;
    this.deleteIndex = index;
    this.modalService.open(delete_Immunization, { centered: true, size: "md" });
  }


  delete_ImmunizationById() {
    let reqData = {
      immunization_id: this.deleted_id,
      paitent_id: this.patient_id
    }
    console.log("reqData", reqData);
    this.service.deleteImmunization(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.toastr.success(response.message);
        this.modalService.dismissAll();
        this.immunization.removeAt(this.deleteIndex);
        this.selectImmunization_id.splice(this.deleteIndex, 1)
        this.selectImmunization.splice(this.deleteIndex, 1)
      } else {
        this.toastr.error(response.message);
      }
    });
  }
  //-----------------------------History Form Handling-----------------------------
  patientHistoryValidation(index, validation_for: any) {
    let passString = "";
    if (validation_for === 1) {
      passString = "patient_history";
    } else if (validation_for === 2) {
      passString = "allergies";
    } else if (validation_for === 3) {
      passString = "lifestyle";
    } else {
      passString = "familial_history";
    }

    let historyForm = this.historyForm.get(passString) as FormArray;
    const formGroup = historyForm.controls[index] as FormGroup;
    return formGroup;
  }

  get patient_history() {
    return this.historyForm.controls["patient_history"] as FormArray;
  }

  get allergies() {
    return this.historyForm.controls["allergies"] as FormArray;
  }

  get lifestyle() {
    return this.historyForm.controls["lifestyle"] as FormArray;
  }

  get familial_history() {
    return this.historyForm.controls["familial_history"] as FormArray;
  }

  addNewPatient_History() {
    const newHistoryForm = this.fb.group({
      type: [""],
      name: [""],
      start_date: [""],
    });
    this.patient_history.push(newHistoryForm);
  }

  addNewAllergies() {
    const newAllergies = this.fb.group({
      type: [""],
      start_date: [""],
    });
    this.allergies.push(newAllergies);
  }

  addNewLifestyle() {
    const newLifestyle = this.fb.group({
      type: [""],
      type_name: [""],
      start_date: [""],
    });
    this.lifestyle.push(newLifestyle);
  }

  addNewFamilial_history() {
    const newFamilialHistory = this.fb.group({
      relationship: [""],
      family_history_type: [""],
      history_name: [""],
      start_date: [""],
    });
    this.familial_history.push(newFamilialHistory);
  }

  deletePatient_History(index: number) {
    this.patient_history.removeAt(index);
  }

  deleteAllergies(index: number) {
    this.allergies.removeAt(index);
  }

  deleteLifestyle(index: number) {
    this.lifestyle.removeAt(index);
  }

  deleteFamilialHistory(index: number) {
    this.familial_history.removeAt(index);
  }

  //--------------------------Medical Documnets Form Handling------------------------
  medDocValidation(index) {
    let docs = this.medicalDocumentForm.get("medical_document") as FormArray;
    const formGroup = docs.controls[index] as FormGroup;
    return formGroup;
  }

  get medical_document() {
    return this.medicalDocumentForm.controls["medical_document"] as FormArray;
  }

  addNewMedicalDocument() {
    const newMedicalDoc = this.fb.group({
      name: [""],
      issue_date: [""],
      expiration_date: [""],
      image: [""],
    });
    this.medical_document.push(newMedicalDoc);
  }

  deleteMedicalDoc(index: number) {
    this.medical_document.removeAt(index);
  }

  //--------------------------Family members Form Handling---------------------------
  familyValidations(index, validation_for: any) {
    let passString = "";
    if (validation_for === 1) {
      passString = "family_members";
    } else if (validation_for === 2) {
      passString = "medical_history";
    } else {
      passString = "social_history";
    }

    let docs = this.familyMembersForm.get(passString) as FormArray;
    const formGroup = docs.controls[index] as FormGroup;
    return formGroup;
  }

  get family_members() {
    return this.familyMembersForm.controls["family_members"] as FormArray;
  }

  get medical_history() {
    return this.familyMembersForm.controls["medical_history"] as FormArray;
  }

  get social_history() {
    return this.familyMembersForm.controls["social_history"] as FormArray;
  }

  addNewFamilyMember() {
    const newFamilyMember = this.fb.group({
      first_name: [""],
      last_name: [""],
      ssn_number: [""],
      gender: [""],
      relationship: [""],
      dob: [""],
      mobile_number: [
        "",
       
      ],
    });
    this.family_members.push(newFamilyMember);
  }

  addNewMedicalHistory() {
    const newMedicalHistory = this.fb.group({
      allergy_type: [""],
      allergen: [""],
      note: [""],
      reaction: [""],
      status: [""],
      created_date: [""],
    });
    this.medical_history.push(newMedicalHistory);
  }

  addNewSocialHistory() {
    const newSocialHistory = this.fb.group({
      alcohol: [""],
      tobacco: [""],
      drugs: [""],
      occupation: [""],
      travel: [""],
      start_date: [""],
    });
    this.social_history.push(newSocialHistory);
  }

  deleteFamilyMember(index: number) {
    this.family_members.removeAt(index);
  }
  deleteMedicalHistory(index: number) {
    this.medical_history.removeAt(index);
  }
  deleteSocialHistory(index: number) {
    this.social_history.removeAt(index);
  }

  handleDOBChange(event: any, dob_for: any) {
    let patientAge = this.calculateAge(event.value);

    if (dob_for === "personalDetails") {
      this.personalDetails.patchValue({
        age: patientAge,
      });
    } else if (dob_for === "primary_insured") {
      this.insuranceDetails.patchValue({
        primary_insured: { age: patientAge },
      });
    } else {
      this.insuranceDetails.patchValue({
        secondary_insured: { age: patientAge },
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

  get f2() {
    return this.insuranceDetails.controls;
  }

  get emergency_contact_validation() {
    let emergency_contact = this.personalDetails.get(
      "emergency_contact"
    ) as FormGroup;

    return emergency_contact.controls;
  }

  goBack() {
    this.mainStepper.previous();
  }

  goForward() {
    this.mainStepper.next();
  }

  goNext() {
    setTimeout(() => {
      this.mainStepper.next();
    }, 1000);
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

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

  getImmunizationList() {
    this.service.vaccineList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log(response ,"kkk");
      
      this.immunizationList = response?.data?.result;
      // immunizationList.map((immunization)=>{
      // this.immunizationList.push(
      //   {
      //     label : immunization.name,
      //     value : immunization._id
      //   }
      // )
 
      
      // })
      console.log(this.imunizationData);
      // for (let i = 0; i <= this.imunizationData?.length - 1; i++) {
      //   if (i != 0 ) {
      //     this.addNewImmunization();
      //   }
  
      //   this.selectImmunization.push(this.imunizationData[i].name);
      //   this.selectImmunization_id.push(this.imunizationData[i]._id);
  
      // }
      // this.immunization.patchValue(this.imunizationData);
    
      // console.log(this.immunizationList , "lll");
      
    });
  }

  getPatientHistoryTypeList() {
    this.service.patientHistoryTypeList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.patientHistoryTypeList = response?.body;
    });
  }

  getAllAllergies() {
    this.service.allergiesList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.allergyList = response?.body;
    });
  }

  getLifestyleList() {
    this.service.lifestyleTypeList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.lifestyleList = response?.body;
    });
  }

  getFamilyHistoryType() {
    this.service.familyHistoryTypeList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.familyHistoryTypeList = response?.body;
    });
  }

  //----------------Insurance tab changes work-----------------
  insuranceCompanyList: any[] = [];
  primaryInsurance: any;
  secondaryInsurance: any = [];
  showInsurance: any = false;
  subscriberDetails: any;

  getInsuranceCompanyList() {
    this.service.getInsuanceList().subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      const insuranceCompanyList = response?.body?.result;
      insuranceCompanyList.map((insurance)=>{
        this.insuranceCompanyList.push(
          {
            label : insurance.company_name,
            value : insurance.for_portal_user?._id
          }
        )
        console.log(this.insuranceCompanyList);
        
      })
      console.log("INSURANCE List======>", this.insuranceCompanyList);
    });
  }

  getInsuranceDetails() {
    let formattedDOB = this.datePipe.transform(
      this.insuranceDetails.value.dob,
      "yyyy-MM-dd"
    );
    let reqData = {
      insurance_id: this.insuranceDetails.value.insurance_id,
      firstName: this.insuranceDetails.value.firstName,
      lastName: this.insuranceDetails.value.lastName,
      mobile: this.insuranceDetails.value.mobile,
      dob: formattedDOB,
    };
    console.log("REQDATA====>", reqData);
    this.service.getInsuranceDetails(reqData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("INSURANCE DETAILS======>", response);
        if (response.status) {
          this.showInsurance = true;
          this.actualsubscriberId = response?.body?.actualsubscriberId;
          if (response?.body?.subscriberList.subscription_for === "Primary") {
            this.primaryInsurance = response?.body?.subscriberList;
            if (response?.body?.subscriberList.secondary_subscriber) {
              this.secondaryInsurance = response?.body?.subscriberList.secondary_subscriber;
              console.log("INSURANCE DETAILS s======>", this.secondaryInsurance);

            }

          } else {
            this.secondaryInsurance = [response?.body?.subscriberList];
            console.log("INSURANCE DETAILS s2======>", this.secondaryInsurance);
          }


        } else {          
          this.primaryInsurance = "";
          this.secondaryInsurance = [];
          this.openVerticallyCenteredrejectappointment(this.insurancenotfound);
          this.showInsurance = false;

        }

      },
      (err) => {
        this.openVerticallyCenteredrejectappointment(this.insurancenotfound);
      }
    );
  }
  openVerticallyCenteredrejectappointment(insurancenotfound: any) {
    this.modalService.open(insurancenotfound, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }
  saveInsuranceDetails() {
    let reqData = {
      patient_id: this.patient_id,
      primary_subscriber_id: "",
      secondary_subscriber_ids: [],
      insurance_id: this.insuranceDetails.value.insurance_id,
      all_subscriber_ids: [],
    };

    if (this.primaryInsurance) {
      reqData.primary_subscriber_id = this.primaryInsurance?._id;
      reqData.all_subscriber_ids.push({
        subscriber_id: this.primaryInsurance?._id,
        name: this.primaryInsurance?.subscriber_full_name,
        subscription_for: this.primaryInsurance?.subscription_for,
      });
    }

    if (this.secondaryInsurance != undefined) {
      this.secondaryInsurance.forEach((element) => {
        reqData.secondary_subscriber_ids.push(element?._id);

        reqData.all_subscriber_ids.push({
          subscriber_id: element?._id,
          name: element?.subscriber_full_name,
          subscription_for: element?.subscription_for,
        });
      });
    }

    console.log("REQDATA====>", reqData);

    this.service.insuranceDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.toastr.success(response.message);
        if (!this.isUpdating) {
          this.isInsurance = true;
          this.goNext();
        } else {
          this.goForward();
        }
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handleSelectInsurance(event: any) {
    if (event.value === this.addedInsId) {
      this.showOtherSearchFields = false;
      this.primaryInsurance = this.subscriberDetails?.subscriber_details;
      this.secondaryInsurance =
        this.subscriberDetails?.subscriber_details?.secondary_subscriber;
    } else {
      this.showOtherSearchFields = true;
    }
  }

  viewSubscriberDetails(subscriberId: any) {
    this.insuranceSubscriber
      .viewSubscriberDetails(subscriberId)
      .subscribe((res: any) => {
        const response = this._coreService.decryptObjectData(JSON.parse(res));
        this.subscriberDetails = response?.body;
        this.primaryInsurance = response.body.subscriber_details;
        this.secondaryInsurance =
          response?.body?.subscriber_details?.secondary_subscriber;
        this.showInsurance = true;
      });
  }

  // Quick view modal
  openVerticallyCenteredquickview(quick_view: any, url: any) {
    this.setDocToView = url;
    this.modalService.open(quick_view, {
      centered: true,
      size: "lg",
      windowClass: "quick_view",
    });
  }
  skipTab(){  
      this.isInsurance = true;
      this.isVitals = true;
      this.isMedicines = true;
      this.isImmunization = true;
      this.isFamily = true;
      this.isHistory = true;
      this.isMedDocs = true;  
      this.goForward();
    }

    calculateBMI(): void {
      const height = this.addVitals.get('height').value;
      const weight = this.addVitals.get('weight').value;
  
      if (height && weight) {
        const bmi = (weight / (height * height)).toFixed(2); // Calculate BMI
        this.addVitals.get('bmi').setValue(bmi); // Update BMI value in the form
      }
    }
    downloadpdf(data:any) {
    
      window.location.href = data;
    }
  
}
