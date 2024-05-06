import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../../insurance.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: "app-insuranceanalysis",
  templateUrl: "./insuranceanalysis.component.html",
  styleUrls: ["./insuranceanalysis.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceanalysisComponent implements OnInit {
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
  years: number[] = [];
  selectedYear: number;
  staffId: any = ""
  statusCountData: any;
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  totalSubscriberCount: any;
  subscriberType: any = '';
  yearFilter: any = '';

  constructor(
    private _coreService: CoreService,
    private insuranceService: InsuranceService,
    private modalService: NgbModal,
    private route: Router
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.yeardropdown()

  }

  yeardropdown(){
    const currentYear = new Date().getFullYear();
  
    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }
  
    this.selectedYear = currentYear;
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


    if(this.years.length>0){
      this.getYear(this.years[0])
    }
  }

  getYear(year){
    // this.startDateFilter="";
    // this.endDateFilter ="";
    // let startDate=year+"-01-01T18:30:00.000Z"
    // let endDate=year+"-12-31T18:30:00.000Z"
    this.yearFilter = year
    this.subscriberCount();
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

    this.insuranceService.polyClaim_dashboard(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      
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

  closePopup() {
    this.modalService.dismissAll("close");
  }

  generatePdf(): void {
    const content = this.pdfContent.nativeElement;
    const pdfOptions = {
      margin: 10,
      filename: 'pieChart_claimByStatUS.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(pdfOptions).from(content).save();
  }


  subcriberType(event: any) {
    this.subscriberType = event.value;
    this.subscriberCount();
  }



  subscriberCount() {
    let reqData = {
      for_user: this.userID,
      subscription_for: this.subscriberType,
      year: this.yearFilter

    };

    this.insuranceService.insuranceAnalysis_subscriberCount(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      if (response.status == true) {

        this.totalSubscriberCount = response.data;
      }


    });
  }
}
