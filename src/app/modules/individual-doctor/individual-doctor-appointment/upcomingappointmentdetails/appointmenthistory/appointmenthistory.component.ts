import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";

// Patient History Table
export interface PatienthistoryPeriodicElement {
  patienthistorytype: string;
  historyname: string;
  startdate: string;
}
const PATIENT_HISTORY_ELEMENT_DATA: PatienthistoryPeriodicElement[] = [];

// Allergies Table
export interface AllergiesPeriodicElement {
  allergytype: string;
  startdate: string;
}
const ALLERGIES_ELEMENT_DATA: AllergiesPeriodicElement[] = [];

// Lifestyle Table
export interface LifestylePeriodicElement {
  lifestyletype: string;
  lifestyletypename: string;
  startdate: string;
}
const LIFESTYLE_ELEMENT_DATA: LifestylePeriodicElement[] = [];

// Family History Table
export interface FamilyhistoryPeriodicElement {
  relationship: string;
  familyhistorytype: string;
  historyname: string;
  startdate: string;
}
const FAMILYHISTORY_ELEMENT_DATA: FamilyhistoryPeriodicElement[] = [];

@Component({
  selector: "app-appointmenthistory",
  templateUrl: "./appointmenthistory.component.html",
  styleUrls: ["./appointmenthistory.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppointmenthistoryComponent implements OnInit {
  // Patient history Table
  patienthistorydisplayedColumns: string[] = [
    "patienthistorytype",
    "historyname",
    "startdate",
    // "action",
  ];
  patienthistorydataSource: any[] = [];

  // Allergies Table
  allergiesdisplayedColumns: string[] = [
    "allergytype", 
    "startdate", 
    // "action"
  ];
  allergiesdataSource: any[] = [];

  // Lifestyle Table
  lifestyledisplayedColumns: string[] = [
    "lifestyletype",
    "lifestyletypename",
    "startdate",
    // "action",
  ];
  lifestyledataSource: any[] = [];
  // Family History Table
  familyhistorydisplayedColumns: string[] = [
    "relationship",
    "familyhistorytype",
    "historyname",
    "startdate",
    // "action",
  ];
  familyhistorydataSource: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() fromParent: any;
  @Output() refreshDetails = new EventEmitter<string>();

  patient_id: any = "";
  deleteFor: any = "";
  indexForDelete: any = "";
  historyForm: any = FormGroup;
  isSubmitted: boolean = false;
  isUpdating: boolean = false;

  patientHistoryTypeList: any[] = [];
  allergyList: any[] = [];
  lifestyleList: any[] = [];
  familyHistoryTypeList: any[] = [];
  relationshipList: any[] = [];

  // ngAfterViewInit() {
  //   this.patienthistorydataSource.paginator = this.paginator;
  //   this.allergiesdataSource.paginator = this.paginator;
  //   this.lifestyledataSource.paginator = this.paginator;
  //   this.familyhistorydataSource.paginator = this.paginator;
  // }

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.historyForm = this.fb.group({
      patient_history: this.fb.array([]),
      allergies: this.fb.array([]),
      lifestyle: this.fb.array([]),
      familial_history: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.patient_id = this.fromParent?.patient_id;
    this.patienthistorydataSource = this.fromParent?.history?.patient_history;
    this.allergiesdataSource = this.fromParent?.history?.allergies;
    this.lifestyledataSource = this.fromParent?.history?.lifestyle;
    this.familyhistorydataSource = this.fromParent?.history?.familial_history;

    this.getPatientHistoryTypeList();
    this.getAllAllergies();
    this.getLifestyleList();
    this.getFamilyHistoryType();
    this.getCommonData();
  }

  ngOnChanges() {
    this.patienthistorydataSource = this.fromParent?.history?.patient_history;
    this.allergiesdataSource = this.fromParent?.history?.allergies;
    this.lifestyledataSource = this.fromParent?.history?.lifestyle;
    this.familyhistorydataSource = this.fromParent?.history?.familial_history;
  }

  handleAddPatientHistory() {
    this.isSubmitted = true;
    if (this.historyForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let patient_history = [];
    let allergies = [];
    let lifestyle = [];
    let familial_history = [];

    if (this.isUpdating) {
      (patient_history = this.historyForm.value.patient_history),
        (allergies = this.historyForm.value.allergies),
        (lifestyle = this.historyForm.value.lifestyle),
        (familial_history = this.historyForm.value.familial_history);
    } else {
      if (this.patienthistorydataSource != undefined) {
        patient_history = [...this.patienthistorydataSource];
      }

      if (this.allergiesdataSource != undefined) {
        allergies = [...this.allergiesdataSource];
      }

      if (this.lifestyledataSource != undefined) {
        lifestyle = [...this.lifestyledataSource];
      }

      if (this.familyhistorydataSource != undefined) {
        familial_history = [...this.familyhistorydataSource];
      }

      this.historyForm.value.patient_history.forEach((element) => {
        patient_history.push(element);
      });

      this.historyForm.value.allergies.forEach((element) => {
        allergies.push(element);
      });

      this.historyForm.value.lifestyle.forEach((element) => {
        lifestyle.push(element);
      });

      this.historyForm.value.familial_history.forEach((element) => {
        familial_history.push(element);
      });
    }

    let reqData = {
      patient_id: this.patient_id,
      patient_history: patient_history,
      allergies: allergies,
      lifestyle: lifestyle,
      familial_history: familial_history,
    };

    console.log("REQUEST DATA===>", reqData);

    this.patientService.patientHistory(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      if (response.status) {
        this.isUpdating = false;
        this.closePopup();
        this.toastr.success(response.message);
        this.refreshDetails.emit("refresh");
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handleDelete() {
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
  }

  deleteHistory(reqData: any) {
    this.patientService.patientHistory(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      if (response.status) {
        this.toastr.success("Deleted Successfully");
        this.modalService.dismissAll("close");
        this.refreshDetails.emit("refresh");
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
      type: ["", [Validators.required]],
      name: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
    });
    this.patient_history.push(newHistoryForm);
  }

  addNewAllergies() {
    const newAllergies = this.fb.group({
      type: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
    });
    this.allergies.push(newAllergies);
  }

  addNewLifestyle() {
    const newLifestyle = this.fb.group({
      type: ["", [Validators.required]],
      type_name: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
    });
    this.lifestyle.push(newLifestyle);
  }

  addNewFamilial_history() {
    const newFamilialHistory = this.fb.group({
      relationship: ["", [Validators.required]],
      family_history_type: ["", [Validators.required]],
      history_name: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
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

  // Add History Model
  openHistoryModal(addHistoryModal: any, open_for: any) {
    if (open_for === "edit") {
      this.isUpdating = true;
      this.historyForm.reset();
      this.patient_history.clear();
      this.allergies.clear();
      this.lifestyle.clear();
      this.familial_history.clear();

      if (this.patienthistorydataSource.length > 0) {
        this.patienthistorydataSource.forEach((element) => {
          this.addNewPatient_History();
        });
      } else {
        this.addNewPatient_History();
      }

      if (this.allergiesdataSource.length > 0) {
        this.allergiesdataSource.forEach((element) => {
          this.addNewAllergies();
        });
      } else {
        this.addNewAllergies();
      }

      if (this.lifestyledataSource.length > 0) {
        this.lifestyledataSource.forEach((element) => {
          this.addNewLifestyle();
        });
      } else {
        this.addNewLifestyle();
      }

      if (this.familyhistorydataSource.length > 0) {
        this.familyhistorydataSource.forEach((element) => {
          this.addNewFamilial_history();
        });
      } else {
        this.addNewFamilial_history();
      }

      this.historyForm.patchValue({
        patient_history: this.patienthistorydataSource,
        allergies: this.allergiesdataSource,
        lifestyle: this.lifestyledataSource,
        familial_history: this.familyhistorydataSource,
      });
    } else {
      this.isUpdating = false;
      this.historyForm.reset();
      this.patient_history.clear();
      this.allergies.clear();
      this.lifestyle.clear();
      this.familial_history.clear();

      this.addNewPatient_History();
      this.addNewAllergies();
      this.addNewLifestyle();
      this.addNewFamilial_history();
    }

    this.modalService.open(addHistoryModal, {
      centered: true,
      size: "xl",
      windowClass: "add_immunization",
    });
  }

  myFilter = (d: Date | null): any => {
    // const day = (d || new Date()).getDay();
    // return day !== 0 && day !== 6;
    return true;
  };

  openVerticallyCenteredsecond(deleteModal: any, index: any, deleteFor: any) {
    this.indexForDelete = index;
    this.deleteFor = deleteFor;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
  }

  getPatientHistoryTypeList() {
    this.patientService.patientHistoryTypeList().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.patientHistoryTypeList = response?.body;
    });
  }

  getAllAllergies() {
    this.patientService.allergiesList().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.allergyList = response?.body;
    });
  }

  getLifestyleList() {
    this.patientService.lifestyleTypeList().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.lifestyleList = response?.body;
    });
  }

  getFamilyHistoryType() {
    this.patientService.familyHistoryTypeList().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.familyHistoryTypeList = response?.body;
    });
  }

  getCommonData() {
    this.patientService.commonData().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.relationshipList = response?.body?.relationship;
    });
  }

  closePopup() {
    this.historyForm.reset();
    this.patient_history.clear();
    this.allergies.clear();
    this.lifestyle.clear();
    this.familial_history.clear();

    this.addNewPatient_History();
    this.addNewAllergies();
    this.addNewLifestyle();
    this.addNewFamilial_history();

    this.modalService.dismissAll("close");
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
