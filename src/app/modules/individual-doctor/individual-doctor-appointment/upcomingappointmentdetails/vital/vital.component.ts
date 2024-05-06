import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";

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

@Component({
  selector: "app-vital",
  templateUrl: "./vital.component.html",
  styleUrls: ["./vital.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VitalComponent implements OnInit {
  // Vital table
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
  vitalsdataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() fromParent: any;
  @Output() refreshDetails = new EventEmitter<string>();

  doctor_id:any=""
  patient_id: any = "";
  bloodGroupList: any[] = [];
  vitalForm: any = FormGroup;
  userRole: any;
  ngAfterViewInit() {
    this.vitalsdataSource.paginator = this.paginator;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService
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
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem('loginData'))
    this.userRole = loginData?.role;
    this.doctor_id = loginData?._id
    this.patient_id = this.fromParent?.patient_id;
    this.vitalsdataSource = this.fromParent?.vitals;
    this.bloodGroupList = this.fromParent?.bloodGroups;
  }

  ngOnChanges() {
    this.vitalsdataSource = this.fromParent?.vitals;
  }

  handleAddVitals() {
    let reqData = { ...this.vitalForm.value, patient_id: this.patient_id,doctor_id:this.doctor_id };

    console.log("REQUESTA DATA===>", reqData);
    this.patientService.addVitals(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      if (response.status) {
        this.closePopup()
        this.toastr.success(response.message);
        this.refreshDetails.emit("refresh");
      } else {
        this.toastr.error(response.message);
      }
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

  // Add Vital Model
  openVitalModal(vitalModal: any) {
    this.modalService.open(vitalModal, {
      centered: true,
      size: "xl",
      windowClass: "add_vital",
    });
  }

  closePopup(){
    this.vitalForm.reset()
    this.modalService.dismissAll('close')
  }
}
