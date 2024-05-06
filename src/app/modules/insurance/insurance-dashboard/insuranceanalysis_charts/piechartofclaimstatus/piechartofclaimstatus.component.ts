import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../../../insurance.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: 'app-piechartofclaimstatus',
  templateUrl: './piechartofclaimstatus.component.html',
  styleUrls: ['./piechartofclaimstatus.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PiechartofclaimstatusComponent implements OnInit {
  // pie chart
  public pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
  };
  public pieChartDatasets = [
    {
      data: [500, 300, 200],
      // label: ["Approved", "Reject", "Pending", "Pre-Auth"],
      backgroundColor: ["#4F90F2", "#FFD57A", "#0B4977"],
      hoverBackgroundColor: ["#4F90F2", "#FFD57A", "#0B4977"],
      hoverBorderColor: ["#4F90F2", "#FFD57A", "#0B4977"],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // Doughnut chart
  public doughnutChartDatasets: ChartConfiguration<"doughnut">["data"]["datasets"] =
    [
      {
        data: [200, 300, 200, 300],
        // label: ["Approved", "Reject", "Pending", "Pre-Auth"],

        backgroundColor: ["#62D94F", "#FFD57A", "#F46666", "#4F90F2"],
        hoverBackgroundColor: ["#62D94F", "#FFD57A", "#F46666", "#4F90F2"],
        hoverBorderColor: ["#62D94F", "#FFD57A", "#F46666", "#4F90F2"],
        borderWidth: 5,
        hoverBorderWidth: 0,
      },
    ];

  public doughnutChartOptions: ChartConfiguration<"doughnut">["options"] = {
    responsive: true,
  };

  // Doughnut chart2
  public doughnutChart2Datasets: ChartConfiguration<"doughnut">["data"]["datasets"] =
    [
      {
        data: [800, 200],
        label: "Reputation",
        backgroundColor: ["#62D94F", "#0B4977"],
        hoverBackgroundColor: ["#62D94F", "#0B4977"],
        hoverBorderColor: ["#62D94F", "#0B4977"],
        borderWidth: 5,
        hoverBorderWidth: 0,
      },
    ];

  public doughnutChart2Options: ChartConfiguration<"doughnut">["options"] = {
    responsive: true,
  };

  userID: any = "";
  staffRole: any = "INSURANCE_ADMIN";

  staffId: any = ""
  statusCountData: any;
 @Input() yearFilter:any = ''; 

  constructor(
    private _coreService: CoreService,
    private insuranceService: InsuranceService,
    private modalService: NgbModal,
    private route: Router
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    // this.checkForPlan();
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    let role = loginData?.role;

    if (role === "INSURANCE_ADMIN") {
      this.userID = loginData?._id;
    } else {

      this.userID = adminData?.for_user;
      if (adminData?.role) {
        let staffRole = adminData?.role[0];
        this.staffRole = staffRole?.name
        this.staffId = loginData?._id;
        console.log("ELSEEEEE", this.staffRole);

      }
    }
console.log("this.......__________",this.yearFilter);

    this.countClaims();
  }

  async checkForPlan() {
    let isPurchased = await this.insuranceService.isPlanPurchesdByInsurance(
      this.userID
    );

    if (!isPurchased) {
      this._coreService.showError(
        "No plan purchsed! Please purches new plan",
        ""
      );
      this.route.navigate(["/insurance/subscriptionplan"]);
    }
  }

  areAllValuesZeroOrUndefined(arr: number[]): boolean {
    return arr.every(value => value === 0 || value === undefined);
  }

  countClaims() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      year: this.yearFilter
    };
console.log("PIE____________", reqData);

    this.insuranceService.polyClaim_dashboard(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("response------------",response);
      
      this.statusCountData = response?.data;     
      this.doughnutChartDatasets =  this.areAllValuesZeroOrUndefined([this.statusCountData.approved, this.statusCountData.pending, this.statusCountData.reject,this.statusCountData.preauth ])
      ? null
      :[
        {        

          data: [this.statusCountData.approved, this.statusCountData.pending, this.statusCountData.reject,this.statusCountData.preauth ],
          // label: ["Approved", "Reject", "Pending", "Pre-Auth"],
  
          backgroundColor: ["#62D94F", "#FFD57A", "#F46666", "#4F90F2"],
          hoverBackgroundColor: ["#62D94F", "#FFD57A", "#F46666", "#4F90F2"],
          hoverBorderColor: ["#62D94F", "#FFD57A", "#F46666", "#4F90F2"],
          borderWidth: 5,
          hoverBorderWidth: 0,
        },
      
      ]
    });
  }


  openVerticallyCenteredbarChart(piechartstatus2: any) {  
    this.modalService.open(piechartstatus2, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
    });
  }
}
