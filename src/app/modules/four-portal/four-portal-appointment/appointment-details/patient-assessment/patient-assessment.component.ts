import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { FourPortalService } from "../../../four-portal.service";

@Component({
 selector: 'app-patient-assessment',
  templateUrl: './patient-assessment.component.html',
  styleUrls: ['./patient-assessment.component.scss']
})

export class PatientAssessmentComponent implements OnInit {
  appointmentId: any;
  assessmentsList: any = [];

  constructor(
    private fourPortalService: FourPortalService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,

  ) {}

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.appointmentId = paramId;

    this.getAssessmentList();
  }

  getAssessmentList() {
    let reqData = {
      appointmentId: this.appointmentId,
    };

    this.fourPortalService.fourPortal_listAssesment_Appointment(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        if (response?.body != null) {
          this.assessmentsList = response?.body?.assessments;
        }
      }
    });
  }
}
