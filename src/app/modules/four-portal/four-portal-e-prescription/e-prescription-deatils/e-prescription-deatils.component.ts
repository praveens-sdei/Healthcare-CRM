import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { FourPortalService } from "../../four-portal.service";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";

@Component({
  selector: 'app-e-prescription-deatils',
  templateUrl: './e-prescription-deatils.component.html',
  styleUrls: ['./e-prescription-deatils.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EPrescriptionDeatilsComponent implements OnInit {
  appointmentId: any = "";
  patient_id: any = "";
  patientDetails: any;

  eprescriptionDetails: any;
  userType: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private sadminService: SuperAdminService,
    private modalService: NgbModal,
    private route: Router,
    private indiviualDoctorService: IndiviualDoctorService
  ) {

    let loginData = this.coreService.getLocalStorage('loginData');
    this.userType = loginData?.type

   }

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get("id");

    this.getAppointmentDetails();
  }
  routerBack() {
    this.route.navigate([`/portals/appointment/${this.userType}/appointment-details/${this.appointmentId}`])
  }
  getAppointmentDetails() {
    let reqData = {
      appointment_id: this.appointmentId,
      portal_type:this.userType
    }
    this.fourPortalService
      .fourPortal_appointment_deatils(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.patientDetails = response?.data?.patinetDetails;


        if (response.status) {
        }
      });
  }

  handleRoutes(routeTo: any) {
    
    sessionStorage.setItem("appointmentId", this.appointmentId);
    sessionStorage.setItem("patientName", this.patientDetails?.patient_name);

    this.route.navigate([`/portals/eprescription/${this.userType}/${routeTo}`]);
  }
}
