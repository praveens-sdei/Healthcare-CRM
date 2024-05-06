import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";

@Component({
  selector: "app-eprescriptiondetails",
  templateUrl: "./eprescriptiondetails.component.html",
  styleUrls: ["./eprescriptiondetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptiondetailsComponent implements OnInit {
  appointmentId: any = "";
  patient_id: any = "";
  patientDetails: any;

  eprescriptionDetails: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private sadminService: SuperAdminService,
    private modalService: NgbModal,
    private route: Router,
    private indiviualDoctorService: IndiviualDoctorService
  ) { }

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("Appointment Id=====>", this.appointmentId);

    this.getAppointmentDetails();
  }
  routerBack() {
    this.route.navigate([`/individual-doctor/appointment/appointmentdetails/${this.appointmentId}`])
  }
  getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.patientDetails = response?.data?.patinetDetails;

        console.log("DEtails====>", response);

        console.log("PATIENT  DETAILS====>", this.patientDetails);
        if (response.status) {
        }
      });
  }

  handleRoutes(routeTo: any) {
    sessionStorage.setItem("appointmentId", this.appointmentId);
    sessionStorage.setItem("patientName", this.patientDetails?.patient_name);

    this.route.navigate([`/individual-doctor/eprescription/${routeTo}`]);
  }
}
