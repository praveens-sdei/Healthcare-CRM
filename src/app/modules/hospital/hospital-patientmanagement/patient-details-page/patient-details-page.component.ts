import { PatientService } from "src/app/modules/patient/patient.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { DatePipe } from "@angular/common";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { InsuranceSubscriber } from "src/app/modules/insurance/insurance-subscriber.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

// Vital table
export interface PeriodicElement {
  date: string;
  height: string;
  weight: string;
  hrate: number;
  bmi: string;
  bp: string;
  pulse: number;
  resp: number;
  temp: number;
  bloodgroup: string;
  clearance: number;
  hepaticssummary: number;
}
const ELEMENT_DATA: PeriodicElement[] = [];

// Medication table
export interface MedicationPeriodicElement {
  medicine: string;
  dose: number;
  frequency: string;
  strength: number;
  startdate: string;
  enddate: string;
}
const MEDICATION_ELEMENT_DATA: MedicationPeriodicElement[] = [];

// Medicine table
export interface MedicinePeriodicElement {
  medicine: string;
  dose: number;
  frequency: string;
  strength: number;
  startdate: string;
  enddate: string;
}
const MEDICINE_ELEMENT_DATA: MedicinePeriodicElement[] = [];

// Immunization table
export interface ImmunizationPeriodicElement {
  name: string;
  administereddate: string;
  manufacturedname: string;
  medicalcentre: string;
  batchnumber: string;
  routeofadministration: string;
  nextimmunizationdate: string;
}
const IMMUNIZATION_ELEMENT_DATA: ImmunizationPeriodicElement[] = [];

// Patient History table
export interface PatienthistoryPeriodicElement {
  patienthistorytype: string;
  historyname: string;
  startdate: string;
}
const PATIENTHISTORY_ELEMENT_DATA: PatienthistoryPeriodicElement[] = [];

// Allergies table
export interface AllergiesPeriodicElement {
  allergytype: string;
  startdate: string;
}
const ALLERGIES_ELEMENT_DATA: AllergiesPeriodicElement[] = [];

// Lifestyle table
export interface LifestylePeriodicElement {
  lifestyletype: string;
  lifestyletypename: string;
  startdate: string;
}
const LIFESTYLE_ELEMENT_DATA: LifestylePeriodicElement[] = [];

// Family History table
export interface FamilyhistoryPeriodicElement {
  relationship: string;
  familyhistorytype: string;
  historyname: string;
  startdate: string;
}
const FAMILYHISTORY_ELEMENT_DATA: FamilyhistoryPeriodicElement[] = [];

// Dependent & Family Members table
export interface DependentPeriodicElement {
  name: string;
  ssnnumber: number;
  gender: string;
  dateofbirth: string;
  reletionship: string;
  mobilenumber: string;
}
const DEPENDENT_ELEMENT_DATA: DependentPeriodicElement[] = [];

// Medical History table
export interface MedicalhistoryPeriodicElement {
  allergytype: string;
  allergen: string;
  note: string;
  reaction: string;
  status: string;
  createddate: string;
}
const MEDICALHISTORY_ELEMENT_DATA: MedicalhistoryPeriodicElement[] = [];

// Social History table
export interface SocialPeriodicElement {
  alcohol: string;
  tobacco: string;
  drugs: string;
  occupation: string;
  travel: string;
}
const SOCIALHISTORY_ELEMENT_DATA: SocialPeriodicElement[] = [];

// Past appointment Table
export interface PastappointmentPeriodicElement {
  doctor: string;
  orderid: string;
  dateandtime: string;
  consultationtype: string;
  fee: string;
  status: string;
}
const PASTAPPOINTMENT_ELEMENT_DATA: PastappointmentPeriodicElement[] = [
  {
    doctor: "Cameron Williamson",
    orderid: "#1515411215",
    dateandtime: "08-21-2022 | 03:50Pm",
    consultationtype: "Online",
    fee: "200 CFA",
    status: "Past",
  },
];


@Component({
  selector: 'app-patient-details-page',
  templateUrl: './patient-details-page.component.html',
  styleUrls: ['./patient-details-page.component.scss']
})
export class PatientDetailsPageComponent implements OnInit {

 // Vital table
 @Input() patientId:any;
 openbyvideo:any=false;
vitalsdisplayedColumns: string[] = [
  "date",
  "height",
  "weight",
  "hrate",
  "bmi",
  "bp",
  "pulse",
  "resp",
  "temp",
  "bloodgroup",
  "clearance",
  "hepaticssummary",
];
vitalsdataSource = ELEMENT_DATA;

// Medication table
medicationdisplayedColumns: string[] = [
  "medicine",
  "dose",
  "frequency",
  "strength",
  "startdate",
  "enddate",
  // "action",
];
medicationdataSource = MEDICATION_ELEMENT_DATA;

// Medicine table
medicinedisplayedColumns: string[] = [
  "medicine",
  "dose",
  "frequency",
  "strength",
  "startdate",
  "enddate",
  // "action",
];
medicinedataSource = MEDICINE_ELEMENT_DATA;

// Immunization table
immunizationdisplayedColumns: string[] = [
  "name",
  "administereddate",
  "manufacturedname",
  "medicalcentre",
  "batchnumber",
  "routeofadministration",
  "nextimmunizationdate",
  // "action",
];
immunizationdataSource = IMMUNIZATION_ELEMENT_DATA;

// Patient History table
patienthistorydisplayedColumns: string[] = [
  "patienthistorytype",
  "historyname",
  "startdate",
  // "action",
];
patienthistorydataSource = PATIENTHISTORY_ELEMENT_DATA;

// Allergies table
allergiesdisplayedColumns: string[] = [
  "allergytype",
  "startdate",
  // "action"
];
allergiesdataSource = ALLERGIES_ELEMENT_DATA;

// Lifestyle table
lifestyledisplayedColumns: string[] = [
  "lifestyletype",
  "lifestyletypename",
  "startdate",
  // "action",
];
lifestyledataSource = LIFESTYLE_ELEMENT_DATA;

// Family History table
familyhistorydisplayedColumns: string[] = [
  "relationship",
  "familyhistorytype",
  "historyname",
  "startdate",
  // "action",
];
familyhistorydataSource = FAMILYHISTORY_ELEMENT_DATA;

// Dependent & Family Members table
dependentdisplayedColumns: string[] = [
  "name",
  "ssnnumber",
  "gender",
  "dateofbirth",
  "reletionship",
  "mobilenumber",
  // "action",
];
dependentdataSource = DEPENDENT_ELEMENT_DATA;

// Medical History table
medicalhistorydisplayedColumns: string[] = [
  "allergytype",
  "allergen",
  "note",
  "reaction",
  "status",
  "createddate",
  // "action",
];
medicalhistorydataSource = MEDICALHISTORY_ELEMENT_DATA;

// Social History table
socialhistorydisplayedColumns: string[] = [
  "alcohol",
  "tobacco",
  "drugs",
  "occupation",
  "travel",
  // "action",
];
socialhistorydataSource = SOCIALHISTORY_ELEMENT_DATA;

// Past Appointment Table
pastappointmentdisplayedColumns: string[] = [
  "doctor",
  "orderid",
  "dateandtime",
  "consultationtype",
  "fee",
  "status",
  "action",
];
pastappointmentdataSource = PASTAPPOINTMENT_ELEMENT_DATA;

profile: any;
doctor_id: any = "";
patient_id: any;
appointmentId: any;

insuranceDetails: any;
medicalDocuments: any;

locationData: any;
country: any = "";
region: any = "";
province: any = "";
department: any = "";
city: any = "";
village: any = "";

deleteFor: any = "";
indexForDelete: any = "";

pageSize: number = 5;
totalLength: number = 0;
page: any = 1;
immunizationForm: any = FormGroup;
@ViewChild("rejectappointment") rejectappointment: ElementRef;

isSubmitted: boolean = false;
immunizationOptionsList: any[] = [];

isVitals: boolean = true;
isCurrentMedicines: boolean = true;
isPastMedicines: boolean = true;
isImmunizations: boolean = true;

vitalForm: any = FormGroup;
bloodGroupList: any[] = [];

queryParams: any;
isAssesments: boolean = false;

constructor(
  private acctivatedRoute: ActivatedRoute,
  private _coreService: CoreService,
  private service: PatientService,
  private toastr: ToastrService,
  private datepipe: DatePipe,
  private sadminService: SuperAdminService,
  private coreService: CoreService,
  private modalService: NgbModal,
  private route: Router,
  private insuranceSubscriber: InsuranceSubscriber,
  private fb: FormBuilder,
  private activateRoute: ActivatedRoute
) {
  this.vitalForm = this.fb.group({
    height: [""],
    weight: [""],
    h_rate: [""],
    bmi: [""],
    bp: [""],
    pulse: [""],
    resp: [""],
    temp: [""],
    blood_group: [""],
    clearance: [""],
    hepatics_summary: [""],
  });

  this.immunizationForm = this.fb.group({
    immunization: this.fb.array([]),
  });
}

ngOnInit(): void {
  this.activateRoute.queryParams.subscribe((res) => {
    this.queryParams = res;
    this.patient_id = this.queryParams?.patientId;
    this.doctor_id = this.queryParams?.doctorId
    console.log("SEARCH PARAMS====>", this.queryParams);
  });


 
  this.getAllDetails();
  this.getPastAppointment();
  this.getImmunizationOptionsList();
  this.addNewImmunization();
  this.getCommonData();
}

getAllDetails() {
  let params = {
    patient_id: this.patient_id,
    doctor_id: this.doctor_id,
  };
  console.log(params);
  this.service.profileDetails(params).subscribe(
    (res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      console.log("PATIENT DETAILS====>", response);
      if (response.status && response.body === null) {
        this.openVerticallyCenteredrejectappointment(this.rejectappointment);
      } else {
        this.profile = {
          ...response?.body?.personalDetails,
          ...response?.body?.portalUserDetails,
        };
        this.insuranceDetails = response?.body?.insuranceDetails;

        if (response?.body?.insuranceDetails?.primary_subscriber_id) {
          this.viewSubscriberDetails(
            response?.body?.insuranceDetails?.primary_subscriber_id
          );
        }

        this.isVitals = response?.body?.vitalPermission; //based on perminssions
        this.isCurrentMedicines = response?.body?.currentMedicinePermission;
        this.isPastMedicines = response?.body?.pastMedicinePermission;
        this.isImmunizations = response?.body?.immunizationPermission;

        this.locationData = response?.body?.locationDetails;
        if (this.locationData) {
          this.getCountryList();
          this.getRegionList(this.locationData?.country);
          this.getProvienceList(this.locationData?.region);
          this.getDepartmentList(this.locationData?.province);
          this.getCityList(this.locationData?.department);
        }

        this.vitalsdataSource = response?.body?.vitalsDetails;

        this.medicationdataSource = response?.body?.medicineDetails
          ? response?.body?.medicineDetails?.current_medicines
          : [];

        this.medicinedataSource = response?.body?.medicineDetails
          ? response?.body?.medicineDetails?.past_medicines
          : [];

        this.immunizationdataSource = response?.body?.immunizationDetails
          ? response?.body?.immunizationDetails
          : [];

        this.patienthistorydataSource = response?.body?.historyDetails
          ? response?.body?.historyDetails?.patient_history
          : [];

        this.allergiesdataSource = response?.body?.historyDetails
          ? response?.body?.historyDetails?.allergies
          : [];

        this.lifestyledataSource = response?.body?.historyDetails
          ? response?.body?.historyDetails?.lifestyle
          : [];

        this.familyhistorydataSource = response?.body?.historyDetails
          ? response?.body?.historyDetails?.familial_history
          : [];

        this.dependentdataSource =
          response?.body?.familyDetails?.family_members;

        this.medicalhistorydataSource =
          response?.body?.familyDetails?.medical_history;

        this.socialhistorydataSource =
          response?.body?.familyDetails?.social_history;

        this.medicalDocuments = response?.body?.medicalDocument;
      }
    },
    (err) => {
      let errResponse = this.coreService.decryptObjectData({
        data: err.error,
      });
      this.toastr.error(errResponse.message);
    }
  );
}

handleAddVitals() {
  let reqData = {
    ...this.vitalForm.value,
    patient_id: this.patient_id,
    doctor_id: this.doctor_id,
  };

  console.log("REQUESTA DATA===>", reqData);
  this.service.addVitals(reqData).subscribe((res) => {
    let response = this.coreService.decryptObjectData(res);
    if (response.status) {
      this.closePopup();
      this.toastr.success(response.message);
      this.getAllDetails();
    } else {
      this.toastr.error(response.message);
    }
  });
}

handleDelete() {
  console.log("DATA==============>", this.indexForDelete, this.deleteFor);

  //----------MEDICINES------------------
  let curMedArray: any = [];
  let pastMedArray: any = [];

  if (this.deleteFor === "current_medicine") {
    const array = this.medicationdataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    curMedArray = array;
    pastMedArray = this.medicinedataSource;
  }

  if (this.deleteFor === "past_medicine") {
    const array = this.medicinedataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    curMedArray = this.medicationdataSource;
    pastMedArray = array;
  }

  if (
    this.deleteFor === "current_medicine" ||
    this.deleteFor === "past_medicine"
  ) {
    let reqData = {
      patient_id: this.patient_id,
      current_medicines: curMedArray,
      past_medicines: pastMedArray,
    };

    this.deleteMedicines(reqData);
  }

  //------------HISTORY-----------------------------------
  let patient_history: any = [];
  let allergies: any = [];
  let lifestyle: any = [];
  let familial_history: any = [];

  if (this.deleteFor === "patient_history") {
    const array = this.patienthistorydataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    patient_history = array;
    allergies = this.allergiesdataSource;
    lifestyle = this.lifestyledataSource;
    familial_history = this.familyhistorydataSource;
  }

  if (this.deleteFor === "allergy") {
    const array = this.allergiesdataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    patient_history = this.patienthistorydataSource;
    allergies = array;
    lifestyle = this.lifestyledataSource;
    familial_history = this.familyhistorydataSource;
  }

  if (this.deleteFor === "lifestyle") {
    const array = this.lifestyledataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    patient_history = this.patienthistorydataSource;
    allergies = this.allergiesdataSource;
    lifestyle = array;
    familial_history = this.familyhistorydataSource;
  }

  if (this.deleteFor === "family_history") {
    const array = this.familyhistorydataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    patient_history = this.patienthistorydataSource;
    allergies = this.allergiesdataSource;
    lifestyle = this.lifestyledataSource;
    familial_history = array;
  }

  if (
    this.deleteFor === "patient_history" ||
    this.deleteFor === "allergy" ||
    this.deleteFor === "lifestyle" ||
    this.deleteFor === "family_history"
  ) {
    let reqDataForHistory = {
      patient_id: this.patient_id,
      patient_history: patient_history,
      allergies: allergies,
      lifestyle: lifestyle,
      familial_history: familial_history,
    };

    this.deleteHistory(reqDataForHistory);
  }

  //-----------------FAMILY----------------------------------
  let family_members: any = [];
  let medical_history: any = [];
  let social_history: any = [];

  if (this.deleteFor === "family_members") {
    const array = this.dependentdataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    family_members = array;
    medical_history = this.medicalhistorydataSource;
    social_history = this.socialhistorydataSource;
  }

  if (this.deleteFor === "medical_history") {
    const array = this.medicalhistorydataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    family_members = this.dependentdataSource;
    medical_history = array;
    social_history = this.socialhistorydataSource;
  }

  if (this.deleteFor === "social_history") {
    const array = this.socialhistorydataSource;
    if (this.indexForDelete > -1) {
      array.splice(this.indexForDelete, 1);
    }

    family_members = this.dependentdataSource;
    medical_history = this.medicalhistorydataSource;
    social_history = array;
  }

  if (
    this.deleteFor === "family_members" ||
    this.deleteFor === "medical_history" ||
    this.deleteFor === "social_history"
  ) {
    let reqDataForFamily = {
      patient_id: this.patient_id,
      family_members: family_members,
      medical_history: medical_history,
      social_history: social_history,
    };

    console.log("REQ DATA reqDataForFamily====>", reqDataForFamily);
    this.deleteFamily(reqDataForFamily);
  }
}

deleteMedicines(reqData: any) {
  this.service.medicines(reqData).subscribe((res) => {
    let response = this._coreService.decryptObjectData(res);
    if (response.status) {
      this.toastr.success("Deleted Successfully");
      this.closePopup();
      this.getAllDetails();
    } else {
      this.toastr.error(response.message);
    }
  });
}

deleteHistory(reqData: any) {
  this.service.patientHistory(reqData).subscribe((res) => {
    let response = this._coreService.decryptObjectData(res);
    if (response.status) {
      this.toastr.success("Deleted Successfully");
      this.closePopup();
      this.getAllDetails();
    } else {
      this.toastr.error(response.message);
    }
  });
}

deleteFamily(reqData: any) {
  this.service.dependentFamilyMembers(reqData).subscribe((res) => {
    let response = this._coreService.decryptObjectData(res);
    if (response.status) {
      this.toastr.success("Deleted Successfully");
      this.closePopup();
      this.getAllDetails();
    } else {
      this.toastr.error(response.message);
    }
  });
}

calculateAge(dob: any) {
  let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
  let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  return age;
}

//-------------Calling address api's---------------
getCountryList() {
  this.sadminService.getcountrylist().subscribe({
    next: (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      result.body?.list.forEach((element) => {
        if (element?._id === this.locationData?.country) {
          this.country = element?.name;
        }
      });
    },
    error: (err) => {
      console.log(err);
    },
  });
}

getRegionList(countryID: any) {
  this.sadminService.getRegionListByCountryId(countryID).subscribe({
    next: (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      result.body?.list.forEach((element) => {
        if (element?._id === this.locationData?.region) {
          this.region = element?.name;
        }
      });
    },
    error: (err) => {
      console.log(err);
    },
  });
}

getProvienceList(regionID: any) {
  this.sadminService.getProvinceListByRegionId(regionID).subscribe({
    next: (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      result.body?.list.forEach((element) => {
        if (element?._id === this.locationData?.province) {
          this.province = element?.name;
        }
      });
    },
    error: (err) => {
      console.log(err);
    },
  });
}

getDepartmentList(provinceID: any) {
  this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
    next: (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      result.body?.list.forEach((element) => {
        if (element?._id === this.locationData?.department) {
          this.department = element?.name;
        }
      });
    },
    error: (err) => {
      console.log(err);
    },
  });
}

getCityList(departmentID: any) {
  this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
    next: (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      result.body?.list.forEach((element) => {
        if (element?._id === this.locationData?.city) {
          this.city = element?.name;
        }
      });
    },
    error: (err) => {
      console.log(err);
    },
  });

  this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
    next: (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      result.body?.list.forEach((element) => {
        if (element?._id === this.locationData?.village) {
          this.village = element?.name;
        }
      });
    },
    error: (err) => {
      console.log(err);
    },
  });
}

openVerticallyCenteredsecond(deleteModal: any, index: any, deleteFor: any) {
  this.indexForDelete = index;
  this.deleteFor = deleteFor;
  this.modalService.open(deleteModal, { centered: true, size: "sm" });
}



setDocToView: any = "";

// Quick view modal
openVerticallyCenteredquickview(quick_view: any, url: any) {
  this.setDocToView = url;
  this.modalService.open(quick_view, {
    centered: true,
    size: "lg",
    windowClass: "quick_view",
  });
}

primaryInsurance: any=[];
secondaryInsurance: any=[];

viewSubscriberDetails(subscriberId: any) {
  this.insuranceSubscriber
    .viewSubscriberDetails(subscriberId)
    .subscribe((res: any) => {
      const response = this._coreService.decryptObjectData(JSON.parse(res));
      this.primaryInsurance = response.body.subscriber_details;
      this.secondaryInsurance =
        response?.body?.subscriber_details?.secondary_subscriber[0];

      console.log("SUBSCRIBER DETAILS====>", response);
    });
}

getPastAppointment() {
  let reqData = {
    patient_portal_id: this.patient_id,
    // patient_portal_id: "63d0f8213c4b44b6397794ff",
    limit: this.pageSize,
    page: this.page,
    status: "PAST",
  };
  console.log(reqData);

  this.service.getPastAppointOfPatient(reqData).subscribe((res) => {
    let response = this.coreService.decryptObjectData({ data: res });
    console.log("PAST APPOINTMENT==>", response);
    this.pastappointmentdataSource = response?.data?.data;
    this.totalLength = response?.data?.totalCount;
  });
}

handlePageEvent(data: any) {
  this.page = data.pageIndex + 1;
  this.pageSize = data.pageSize;
}

myFilter = (d: Date | null): boolean => {
  // const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  // return day !== 0 && day !== 6;
  return true;
};

//-----------------------------Immunization Form Handling-----------------------
handleAddImmunization(actionFor: any) {
  if (actionFor === "add") {
    this.isSubmitted = true;
    if (this.immunizationForm.get("immunization").invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      patient_id: this.patient_id,
      doctor_id: this.doctor_id,
      immunization: this.immunizationForm.value.immunization,
    };

    console.log("REQDATA====>", reqData);

    this.service.immunizations(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      if (response.status) {
        this.getAllDetails();
        this.closePopup();
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  } else {
    this.handleEditImmunization();
  }
}

handleEditImmunization() {
  let reqData = {
    patient_id: this.patient_id,
    immunization: this.immunization.at(0).value,
    doctor_id: this.doctor_id,
  };

  console.log("REQUEST DATA==>", reqData);

  this.service.editImmunization(reqData).subscribe((res) => {
    let response = this.coreService.decryptObjectData({ data: res });
    console.log("REs==>", response);
    if (response.status) {
      this.toastr.success(response.message);
      this.closePopup();
      this.getAllDetails();
    }
  });
}
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
    name: ["", [Validators.required]],
    manufactured_name: ["", [Validators.required]],
    medical_centre: ["", [Validators.required]],
    batch_number: ["", [Validators.required]],
    next_immunization_appointment: ["", [Validators.required]],
    administered_date: ["", [Validators.required]],
    route_of_administered: ["", [Validators.required]],
    hcp_provided_immunization: ["", [Validators.required]],
    allow_to_export: [false, [Validators.required]],
  });

  this.immunization.push(newImmunization);
}

deleteImmunization(index: number) {
  this.immunization.removeAt(index);
}

getImmunizationOptionsList() {
  this.service.immunizationList().subscribe((res) => {
    let response = this.coreService.decryptObjectData({ data: res });
    this.immunizationOptionsList = response?.body;
  });
}

isImmunizationUpdating: boolean = false;

// Add Immunization Model
openVerticallyCenteredAddImmunization(
  add_immunization_content: any,
  data: any
) {
  if (data) {
    this.isImmunizationUpdating = true;
    this.resetPopup();
    this.immunization.at(0).patchValue(data);
  } else {
    this.isImmunizationUpdating = false;
  }

  this.modalService.open(add_immunization_content, {
    centered: true,
    size: "xl",
    windowClass: "add_immunization",
  });
}

resetPopup() {
  this.immunizationForm.reset();
  this.immunization.clear();
  this.addNewImmunization();
}

closePopup() {
  this.resetPopup();
  this.vitalForm.reset();
  this.modalService.dismissAll("close");
}

//  No Permission modal
openVerticallyCenteredrejectappointment(rejectappointment: any) {
  this.modalService.open(rejectappointment, {
    centered: true,
    size: "md",
    windowClass: "approved_data",
  });
}

noPermissionHandler() {
  this.modalService.dismissAll("close");
  this.route.navigate(["/hospital/patientmanagement"]);
}

getCommonData() {
  this.service.commonData().subscribe((res) => {
    let response = this.coreService.decryptObjectData({ data: res });
    // this.genderList = response?.body?.gender;
    this.bloodGroupList = response?.body?.bloodGroup;
    // this.martialStatusList = response?.body?.martialStatus;
    // this.spokenLanguageList = response?.body?.spokenLanguage;
    // this.relationshipList = response?.body?.relationship;
  });
}

// Add Vital Model
openVitalModal(vitalModal: any) {
  this.modalService.open(vitalModal, {
    centered: true,
    size: "xl",
    windowClass: "add_vital",
  });
}

handleBack() {

    this.route.navigate(["/hospital/patientmanagement"]);

}
assessmentsList: any[] = [];

getAssessmentList() {
  let reqData = {
    appointmentId: this.appointmentId,
  };

  this.service.getAssessmentList(reqData).subscribe((res) => {
    let response = this.coreService.decryptObjectData({ data: res });
    console.log("ASSESSMENT LIST====>", response);
    if (response.status) {
      this.assessmentsList = response?.body?.assessments;
    }
  });
}


routeTo(id:any,portal_type:any){
  console.log("id___________",id);
  if(portal_type){
    this.route.navigate([`/hospital/patientmanagement/appointment-details`],{
      queryParams : {
        appointmentId: id,
        portal_type: portal_type
      }
    });
  }else{

    this.route.navigate([`/hospital/patientmanagement/appointment-details`],{
      queryParams : {
        appointmentId: id
      }
    });
  }
  
}

}
