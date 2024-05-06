import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

// Current Medication Table
export interface CurrentMedicationPeriodicElement {
  medicine: string;
  dose: string;
  frequency: string;
  strength: string;
  startdate: string;
  enddate: string;
}
const CURRENT_MEDICATION_ELEMENT_DATA: CurrentMedicationPeriodicElement[] = [];

// Past Medication Table
export interface PastMedicationPeriodicElement {
  medicine: string;
  dose: string;
  frequency: string;
  strength: string;
  startdate: string;
  enddate: string;
}
const PAST_MEDICATION_ELEMENT_DATA: PastMedicationPeriodicElement[] = [];

@Component({
  selector: 'app-patient-medicine',
  templateUrl: './patient-medicine.component.html',
  styleUrls: ['./patient-medicine.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PatientMedicineComponent implements OnInit {
  @Input() fromParent: any;
  @Output() refreshDetails = new EventEmitter<string>();

  // Current Medication Table
  currentmedicationdisplayedColumns: string[] = [
    "medicine",
    "dose",
    "frequency",
    "strength",
    "startdate",
    "enddate",
    // "action",
  ];
  currentmedicationdataSource: any[] = [];

  // Past Medication Table
  pastmedicationdisplayedColumns: string[] = [
    "medicine",
    "dose",
    "frequency",
    "strength",
    "startdate",
    "enddate",
    // "action",
  ];
  pastmedicationdataSource: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  patient_id: any = "";
  indexForDelete: any = "";
  deleteFor: any = "";

  medicineForm: any = FormGroup;
  isSubmitted: boolean = false;
  isUpdating: boolean = false;

  isCurrentMedicines:boolean=true
  isPastMedicines:boolean=true

  // ngAfterViewInit() {
  //   this.currentmedicationdataSource.paginator = this.paginator;
  //   this.pastmedicationdataSource.paginator = this.paginator;
  // }

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.medicineForm = this.fb.group({
      current_medicines: this.fb.array([]),
      past_medicines: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.patient_id = this.fromParent?.patient_id;
    this.currentmedicationdataSource = this.fromParent?.medicines?.current_medicines;
    this.pastmedicationdataSource = this.fromParent?.medicines?.past_medicines;
    this.isCurrentMedicines=this.fromParent?.isMedicines?.isCurrentMedicines
    this.isPastMedicines=this.fromParent?.isMedicines?.isPastMedicines

    this.addNewCurrentMedicine();
    this.addNewPastMedicine();
  }

  ngOnChanges() {
    this.currentmedicationdataSource = this.fromParent?.medicines?.current_medicines;
    this.pastmedicationdataSource = this.fromParent?.medicines?.past_medicines;
    this.isCurrentMedicines=this.fromParent?.isMedicines?.isCurrentMedicines
    this.isPastMedicines=this.fromParent?.isMedicines?.isPastMedicines
  }

  handleAddMedicines() {
    this.isSubmitted = true;
    if (
      this.medicineForm.get("current_medicines").invalid ||
      this.medicineForm.get("past_medicines").invalid
    ) {
      return;
    }
    this.isSubmitted = false;
    let current_medicines = [];
    let past_medicines = [];

    if (this.isUpdating) {
      current_medicines = this.medicineForm.value.current_medicines;
      past_medicines = this.medicineForm.value.past_medicines;
    } else {
      if (this.currentmedicationdataSource != undefined) {
        current_medicines = [...this.currentmedicationdataSource];
      }

      if (this.pastmedicationdataSource != undefined) {
        past_medicines = [...this.pastmedicationdataSource];
      }

      this.medicineForm.value.current_medicines.forEach((element) => {
        current_medicines.push(element);
      });

      this.medicineForm.value.past_medicines.forEach((element) => {
        past_medicines.push(element);
      });
    }

    let reqData = {
      patient_id: this.patient_id,
      current_medicines: current_medicines,
      past_medicines: past_medicines,
    };


    this.patientService.medicines(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      if (response.status) {
        this.isUpdating = false;
        this.modalService.dismissAll("close");
        this.toastr.success(response.message);
        this.refreshDetails.emit("refresh");
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  handleDelete() {
    let curMedArray: any = [];
    let pastMedArray: any = [];

    if (this.deleteFor === "current_medicine") {
      const array = this.currentmedicationdataSource;

      if (this.indexForDelete > -1) {
        array.splice(this.indexForDelete, 1);
      }

      curMedArray = array;
      pastMedArray = this.pastmedicationdataSource;
    }

    if (this.deleteFor === "past_medicine") {
      const array = this.pastmedicationdataSource;
      if (this.indexForDelete > -1) {
        array.splice(this.indexForDelete, 1);
      }

      curMedArray = this.currentmedicationdataSource;
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
  }

  deleteMedicines(reqData: any) {
    this.patientService.medicines(reqData).subscribe((res) => {
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

  openVerticallyCenteredsecond(deleteModal: any, index: any, deleteFor: any) {
    this.indexForDelete = index;
    this.deleteFor = deleteFor;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
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

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // Add Medicine Model
  openMedicineModal(medicineModal: any, openFor: any) {
    this.medicineForm.reset();
    this.current_medicines.clear();
    this.past_medicines.clear();

    if (openFor === "edit") {
      this.isUpdating = true;
      if (this.currentmedicationdataSource.length > 0) {
        this.currentmedicationdataSource.forEach((element) => {
          this.addNewCurrentMedicine();
        });
      } else {
        this.addNewCurrentMedicine();
      }

      if (this.pastmedicationdataSource.length > 0) {
        this.pastmedicationdataSource.forEach((element) => {
          this.addNewPastMedicine();
        });
      } else {
        this.addNewPastMedicine();
      }

      this.medicineForm.patchValue({
        current_medicines: this.currentmedicationdataSource,
        past_medicines: this.pastmedicationdataSource,
      });
    } else {
      this.isSubmitted = false;
      this.addNewCurrentMedicine();
      this.addNewPastMedicine();
    }

    this.modalService.open(medicineModal, {
      centered: true,
      size: "xl",
      windowClass: "add_immunization",
    });
  }

  //------------------------Medicine Form Handling--------------------------
  currentMedicineValidation(index) {
    let medicineList = this.medicineForm.get("current_medicines") as FormArray;
    const formGroup = medicineList.controls[index] as FormGroup;
    return formGroup;
  }

  pastMedicineValidation(index) {
    let medicineList = this.medicineForm.get("past_medicines") as FormArray;
    const formGroup = medicineList.controls[index] as FormGroup;
    return formGroup;
  }

  get current_medicines() {
    return this.medicineForm.controls["current_medicines"] as FormArray;
  }

  get past_medicines() {
    return this.medicineForm.controls["past_medicines"] as FormArray;
  }

  addNewCurrentMedicine() {
    const currentNewMedicineForm = this.fb.group({
      medicine: ["", [Validators.required]],
      dose: ["", [Validators.required]],
      frequency: ["", [Validators.required]],
      strength: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
    });
    this.current_medicines.push(currentNewMedicineForm);
  }

  addNewPastMedicine() {
    const pastNewMedicineForm = this.fb.group({
      medicine: ["", [Validators.required]],
      dose: ["", [Validators.required]],
      frequency: ["", [Validators.required]],
      strength: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
    });
    this.past_medicines.push(pastNewMedicineForm);
  }

  deleteCurrentMedicine(index: number) {
    this.current_medicines.removeAt(index);
  }

  deletePastMedicine(index: number) {
    this.past_medicines.removeAt(index);
  }
}
