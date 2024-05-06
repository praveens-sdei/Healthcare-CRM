import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";

@Component({
  selector: "app-assessment",
  templateUrl: "./assessment.component.html",
  styleUrls: ["./assessment.component.scss"],
})
export class AssessmentComponent implements OnInit {
  appointmentId: any;
  assessmentsList: any = [];

  constructor(
    private patientService: PatientService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService
  ) {}

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.appointmentId = paramId;

    this.getAssessmentList();
  }

  getAssessmentList() {
    let reqData = {
      appointmentId: this.appointmentId,
      // appointmentId: "63f8494f588489b9b832d82a",
    };

    this.patientService.getAssessmentList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("ASSESSMENT LIST====>", response);
      if (response.status) {
        if (response?.body != null) {
          this.assessmentsList = response?.body?.assessments;
        }
      }
    });
  }
}
