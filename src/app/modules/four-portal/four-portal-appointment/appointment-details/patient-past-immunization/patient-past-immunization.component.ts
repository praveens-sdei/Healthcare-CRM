import { ToastrService } from "ngx-toastr";
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
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";

// Immunization Table
export interface ImmunizationPeriodicElement {
  name: string;
  administereddate: string;
  manufacturedname: string;
  medicalcentre: string;
  batchnumber: string;
  routeofadministration: string;
  nextimmunizationdate: string;
}
const IMMUNIZATION_MEDICATION_ELEMENT_DATA: ImmunizationPeriodicElement[] = [];

@Component({
  selector: 'app-patient-past-immunization',
  templateUrl: './patient-past-immunization.component.html',
  styleUrls: ['./patient-past-immunization.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PatientPastImmunizationComponent implements OnInit {
  // Immunization Medication Table
  ImmunizationdisplayedColumns: string[] = [
    "name",
    "administereddate",
    "manufacturedname",
    "medicalcentre",
    "batchnumber",
    "routeofadministration",
    "nextimmunizationdate",
    "action",
  ];
  ImmunizationdataSource: any[] = [];

  @Input() fromParent: any;
  @Output() refreshDetails = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  doctor_id: any = "";
  patient_id: any = "";
  immunizationForm: any = FormGroup;
  isSubmitted: boolean = false;
  immunizationOptionsList: any[] = [];
  userRole: any;
  // ngAfterViewInit() {
  //   this.ImmunizationdataSource.paginator = this.paginator;
  // }

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private patientService: PatientService,
    private toastr: ToastrService,
    private coreService: CoreService
  ) {
    this.immunizationForm = this.fb.group({
      immunization: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctor_id = loginData?._id;
    this.userRole = loginData?.role;

    this.patient_id = this.fromParent?.patient_id;
    this.ImmunizationdataSource = this.fromParent?.immunizations;
    this.addNewImmunization();
    this.getImmunizationOptionsList();
  }

  ngOnChanges() {
    this.ImmunizationdataSource = this.fromParent?.immunizations;
  }

  handleAddImmunization(actionFor: any) {
    if (actionFor === "add") {
      this.isSubmitted = true;
      if (this.immunizationForm.get("immunization").invalid) {
        return;
      }
      this.isSubmitted = false;

      let immunization = [];

      if (this.ImmunizationdataSource != undefined) {
        immunization = [...this.ImmunizationdataSource];
      }

      this.immunizationForm.value.immunization.forEach((element) => {
        immunization.push(element);
      });

      let reqData = {
        doctor_id: this.doctor_id,
        patient_id: this.patient_id,
        immunization: this.immunizationForm.value.immunization,
      };


      this.patientService.immunizations(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData(res);
        if (response.status) {
          this.closePopup();
          this.toastr.success(response.message);
          this.refreshDetails.emit("refresh");
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


    this.patientService.editImmunization(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if(response.status){
        this.refreshDetails.emit("refresh");
        this.closePopup()
        this.toastr.success(response.message)
      }
    });
  }

  getImmunizationOptionsList() {
    this.patientService.immunizationList().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.immunizationOptionsList = response?.body;
    });
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
      _id:[""],
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

  // View Immunization Model
  viewImmunization: any;
  openVerticallyCenteredImmunization(
    immunization_content: any,
    immunizationData: any
  ) {
    this.viewImmunization = immunizationData;
    this.modalService.open(immunization_content, {
      centered: true,
      size: "lg",
      windowClass: "view_immunization",
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

  closePopup() {
    this.immunizationForm.reset();
    this.immunization.clear();
    this.addNewImmunization();
    this.modalService.dismissAll("close");
  }
}
