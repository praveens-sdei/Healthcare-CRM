import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { BreakpointObserver } from "@angular/cdk/layout";
import { StepperOrientation } from "@angular/cdk/stepper";
import { FormBuilder, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { map, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { HospitalService } from "../../hospital.service";
import { CoreService } from "src/app/shared/core.service";

@Component({
  selector: "app-adddoctor",
  templateUrl: "./adddoctor.component.html",
  styleUrls: ["./adddoctor.component.scss"],
  encapsulation: ViewEncapsulation.None,
  exportAs: "mainStepper",
})
export class AdddoctorComponent implements OnInit {
  @ViewChild("mainStepper") mainStepper: MatStepper;

  stepperOrientation: Observable<StepperOrientation>;

  basicInfo: boolean = false;
  educationalForm: boolean = false;
  locationForm: boolean = false;
  availability: boolean = false;
  feeManage: boolean = false;
  docManage: boolean = false;
  pageForAdd: boolean = true;

  doctorId: any;
  profileDetails: any;
  passToAvailability: any = {};
  passToChild: any = {};
  isEnable: any = false;
  stepIndex: number = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: HospitalService,
    private coreService: CoreService,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe("(min-width: 1150px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.doctorId = paramId;
    if (paramId === null) {
      this.pageForAdd = true;
      this.passToChild =this.mainStepper;
      this.isEnable = true;
    } else {
      this.pageForAdd = false;
      this.basicInfo = true;
      this.educationalForm = true;
      this.locationForm = true;
      this.availability = true;
      this.feeManage = true;
      this.docManage = true;
      this.getDoctorDetails();
    }
  }

  onStepSelectionChange(event: any) {
    console.log("Step changed:", event.selectedIndex);
    this.stepIndex = event.selectedIndex;
    // Perform any action here based on the step change
  }

  getDoctorDetails(event:any='') {
    console.log("RESPONSE FROM PARENT11111============>")
    this.service.getDoctorProfileDetails(this.doctorId).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE FROM PARENT============>", response);
        this.profileDetails = response?.data?.result[0];
        this.isEnable = true;

        let obj = {
          mainStepper: this.mainStepper,
          response: response,
        };
        this.passToChild = obj;
        console.log("this.passToChild______",this.passToChild)

      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.coreService.showError("", errResponse.message);
      }
    );
  }

  handleEvent(event) {
    console.log("called===========>", event);

    if (event === "basicInfo") {
      this.basicInfo = true;
    }

    if (event === "education") {
      this.educationalForm = true;
    }

    if (event === "location") {
      this.locationForm = true;
    }

    if (event === "availabilty") {
      this.availability = true;
    }

    if (event === "fee") {
      this.feeManage = true;
    }

    if (event === "docs") {
      this.docManage = true;
    }

    this.goForward();
  }

  goForward() {
    setTimeout(() => {
      this.mainStepper.next();
    }, 1000);
  }
}
