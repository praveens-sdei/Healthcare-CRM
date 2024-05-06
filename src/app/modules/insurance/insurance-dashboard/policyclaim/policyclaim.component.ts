import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../../insurance.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as html2pdf from 'html2pdf.js';

export interface PeriodicElement {
  claimdate: string;
  policytype: string;
  claimamount: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    claimdate: "11/18/2020",
    policytype: "Medical Consultation",
    claimamount: "10 000 CFA",
  },
  {
    claimdate: "11/18/2020",
    policytype: "Medical Consultation",
    claimamount: "10 000 CFA",
  },
  {
    claimdate: "11/18/2020",
    policytype: "Medical Consultation",
    claimamount: "10 000 CFA",
  },
  {
    claimdate: "11/18/2020",
    policytype: "Medical Consultation",
    claimamount: "10 000 CFA",
  },
  {
    claimdate: "11/18/2020",
    policytype: "Medical Consultation",
    claimamount: "10 000 CFA",
  },
];

@Component({
  selector: "app-policyclaim",
  templateUrl: "./policyclaim.component.html",
  styleUrls: ["./policyclaim.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PolicyclaimComponent implements OnInit {
  displayedColumns: string[] = ["claimdate", "policytype", "claimamount"];
  dataSource = ELEMENT_DATA;

  // Bar chart
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<"bar">["data"] = {
    labels: ["Medical Consultation", "Medicine", "Hospitalization", "Dental", "Optical", "Laboratory-Imaging", "Paramedical-Professions"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: "Series A",
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#D9EFFF"],
        barThickness: 40,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 10,
        hoverBorderColor: "#D9EFFF",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
    ],
  };
  public barChartOptions: ChartConfiguration<"bar">["options"] = {
    responsive: true,
  };

  //Month Bar chart
  public monthbarChartLegend = false;
  public monthbarChartPlugins = [];

  public monthbarChartData: ChartConfiguration<"bar">["data"] = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [30, 35, 25, 50, 40, 35, 75, 60, 45, 55, 30, 25],
        label: "Series A",
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#0B4977"],
        barThickness: 10,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#0B4977",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
      {
        data: [20, 45, 15, 25, 45, 65, 50, 45, 55, 35, 15, 20],
        label: "Series B",
        backgroundColor: ["#3DA7C8"],
        hoverBackgroundColor: ["#3DA7C8"],
        barThickness: 10,
        borderColor: ["#3DA7C8"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#3DA7C8",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
      {
        data: [30, 35, 25, 50, 40, 35, 75, 60, 45, 55, 30, 25],
        label: "Series A",
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#0B4977"],
        barThickness: 10,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#0B4977",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
      {
        data: [20, 45, 15, 25, 45, 65, 50, 45, 55, 35, 15, 20],
        label: "Series B",
        backgroundColor: ["#3DA7C8"],
        hoverBackgroundColor: ["#3DA7C8"],
        barThickness: 10,
        borderColor: ["#3DA7C8"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#3DA7C8",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
      {
        data: [30, 35, 25, 50, 40, 35, 75, 60, 45, 55, 30, 25],
        label: "Series A",
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#0B4977"],
        barThickness: 10,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#0B4977",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
      {
        data: [20, 45, 15, 25, 45, 65, 50, 45, 55, 35, 15, 20],
        label: "Series B",
        backgroundColor: ["#3DA7C8"],
        hoverBackgroundColor: ["#3DA7C8"],
        barThickness: 10,
        borderColor: ["#3DA7C8"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#3DA7C8",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },
      {
        data: [30, 35, 25, 50, 40, 35, 75, 60, 45, 55, 30, 25],
        label: "Series A",
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#0B4977"],
        barThickness: 10,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#0B4977",
        hoverBorderWidth: 0,
        yAxisID: "y-axis-r",
      },

    ],
  };
  public monthbarChartOptions: ChartConfiguration<"bar">["options"] = {
    responsive: true,
  };

  userID: any = "";

  @ViewChild("confirmationModel") confirmationModel: any;
  staffRole: any = "INSURANCE_ADMIN";
  staffId: any = ""
  statusCountData: any;
  statusCountDataTotal: any;
  countof_eclaim: any;
  mothCountData: any;
  medicalConsultationCount: number = 0;
  medicineCount: any;
  dentalCount: any;
  opticalCount: any;
  hospitalizationCount: any;
  laboratory_imagingCount: any;
  paramedical_professionsCount: any;
  limit: number = 5;
  years: number[] = [];
  selectedYear: number;
  graphyear: number;
  startDateFilter: any = "";
  endDateFilter: any = "";
  @ViewChild('barchartpopup') barchartpopup: TemplateRef<any>;
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  yearFilter: any = '';
  claimTypeFilterData: any = '';
  medicineyearCount: any;
  hospitalizationYearCount: any;
  medicalConsultationYearCount: any;
  dentalyearCount: any;
  lab_imagingyearCount: any;
  opticalyearCount: any;
  para_professionsyearCount: any;
  allMonthCountData: any;

  constructor(
    private _coreService: CoreService,
    private insuranceService: InsuranceService,
    private modalService: NgbModal,
    private route: Router
  ) {
    // const userData = this._coreService.getLocalStorage("loginData");
    // this.userID = userData._id;
    // this.checkForPlan()
    this.yeardropdown()

  }



  yeardropdown() {
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }

    this.selectedYear = currentYear;
    this.graphyear = currentYear;
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


    if (this.years.length > 0) {

      this.getYear1(this.years[0])
      this.getYear(this.years[0]);


    }

  }

  claimTypeFilter(event) {
    this.claimTypeFilterData = event.value
    this.counteClaimsById();
    this.monthCount();
    this.claimtype();
    this.countClaims();
  }

  clearclaimType() {
    this.claimTypeFilterData = ''
    this.counteClaimsById();
    this.monthCount();
    this.claimtype();
    this.countClaims();
  }
  async checkForPlan() {
    let isPurchased = await this.insuranceService.isPlanPurchesdByInsurance(
      this.userID
    ); //check fot purchased plan


    if (!isPurchased) {
      // this.modalService.open(this.confirmationModel);
      this._coreService.showError('No plan purchsed! Please purches new plan', '')
      this.route.navigate(["/insurance/subscriptionplan"]);
    }
  }


  countClaims() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      year: this.yearFilter,
      claimType: this.claimTypeFilterData
    };
    this.insuranceService.polyClaim_dashboard(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.statusCountData = response?.data;
      console.log("this.statusCountData__________", this.statusCountData?.approved);

      this.statusCountDataTotal = this.statusCountData.pending + this.statusCountData.reject + this.statusCountData.approved + this.statusCountData.preauth;
    });
  }



  counteClaimsById() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      year: this.yearFilter,
      claimType: this.claimTypeFilterData

    };
    this.insuranceService.count_eClaims(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {

        this.countof_eclaim = response?.data
      }
    });
  }



  monthCount() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      year: this.yearFilter,
      claimType: this.claimTypeFilterData

    };

    this.insuranceService.polyClaim_dashboardMonthCount(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {

        this.mothCountData = response?.data
      }

    });

  }

  areAllValuesZeroOrUndefined(arr: number[]): boolean {
    return arr.every(value => value === 0 || value === undefined);
  }

  barChart() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      year: this.yearFilter,


    };
    this.insuranceService.polyClaim_dashboardBarChart(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.medicalConsultationCount = response?.data?.medicalConsultation;
        this.medicineCount = response?.data?.medicine;
        this.dentalCount = response?.data?.dental;
        this.opticalCount = response?.data?.optical;
        this.hospitalizationCount = response?.data?.hospitalization;
        this.laboratory_imagingCount = response?.data?.laboratory_imaging;
        this.paramedical_professionsCount = response?.data?.paramedical_professions;


        this.barChartData = this.areAllValuesZeroOrUndefined([this.medicalConsultationCount, this.medicineCount, this.hospitalizationCount, this.dentalCount, this.opticalCount, this.laboratory_imagingCount, this.paramedical_professionsCount])
          ? null
          : {

            labels: ["Medical Consultation", "Medicine", "Hospitalization", "Dental", "Optical", "Laboratory-Imaging", "Paramedical-Professions"],
            datasets: [
              {
                data: [this.medicalConsultationCount, this.medicineCount, this.hospitalizationCount, this.dentalCount, this.opticalCount, this.laboratory_imagingCount, this.paramedical_professionsCount],
                label: "Series A",
                backgroundColor: ["#0B4977"],
                hoverBackgroundColor: ["#D9EFFF"],
                barThickness: 40,
                borderColor: ["#0B4977"],
                borderWidth: 1,
                borderRadius: 10,
                hoverBorderColor: "#D9EFFF",
                hoverBorderWidth: 0,
                yAxisID: "y-axis-r",
              },
            ],
          };

      }

    });
  }


  claimtype() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      limit: this.limit,
      year: this.yearFilter,
      claimType: this.claimTypeFilterData
    };

    this.insuranceService.polyClaim_dashboardClaimtypeList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.dataSource = response?.data;
      }
    });

  }

  openVerticallyCenteredbarChart(barchartpopup: any) {
    this.modalService.open(barchartpopup, {
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
      filename: 'barChart.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(pdfOptions).from(content).save();
  }


  openVerticallyCenteredclaimlistpopup(claimlistpopup: any) {
    this.modalService.open(claimlistpopup, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
    });


  }


  getYear(year) {
    this.startDateFilter = "";
    this.endDateFilter = "";
    let startDate = year + "-01-01T18:30:00.000Z"
    let endDate = year + "-12-31T18:30:00.000Z"
    this.yearFilter = year;

    this.monthWiseClaim(startDate, endDate)

  }


  getYear1(year) {
    this.yearFilter = year;
    this.counteClaimsById();
    this.barChart();
    this.monthCount();
    this.claimtype();
    this.countClaims();
  }


  monthWiseClaim(startyearDate: any, endyearDate: any) {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      createdDate: startyearDate,
      updatedDate: endyearDate,
      year: this.yearFilter

    };
    console.log("REQ_____________", reqData);

    this.insuranceService.polyClaim_allMonthwiseclaim(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      this.allMonthCountData = response.body;
      console.log(" this.allMonthCountData -------------", this.allMonthCountData);

      this.medicineyearCount = Object.values(this.allMonthCountData?.medicine);
      this.hospitalizationYearCount = Object.values(this.allMonthCountData?.hospitalization);
      this.medicalConsultationYearCount = Object.values(this.allMonthCountData?.medicalConsultation);
      this.dentalyearCount = Object.values(this.allMonthCountData?.Dental);
      this.opticalyearCount = Object.values(this.allMonthCountData?.Optical);
      this.lab_imagingyearCount = Object.values(this.allMonthCountData?.Laboratory_Imaging);
      this.para_professionsyearCount = Object.values(this.allMonthCountData?.Paramedical_Professions);


      this.medicineyearCount = Object.values(this.allMonthCountData?.medicine);


      this.monthbarChartData = {
        labels: [
          "January",
          "February",
          "March",
          "Aprirl",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            data: [this.medicineyearCount],
            label: "Series A",
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 10,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
          {
            data: [this.medicalConsultationYearCount
            ],
            label: "Series B",
            backgroundColor: ["#3DA7C8"],
            hoverBackgroundColor: ["#3DA7C8"],
            barThickness: 10,
            borderColor: ["#3DA7C8"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#3DA7C8",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
          {
            data: [this.hospitalizationYearCount],
            label: "Series A",
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 10,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
          {
            data: [this.para_professionsyearCount
            ],
            label: "Series B",
            backgroundColor: ["#3DA7C8"],
            hoverBackgroundColor: ["#3DA7C8"],
            barThickness: 10,
            borderColor: ["#3DA7C8"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#3DA7C8",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
          {
            data: [this.opticalyearCount],
            label: "Series A",
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 10,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
          {
            data: [this.lab_imagingyearCount
            ],
            label: "Series B",
            backgroundColor: ["#3DA7C8"],
            hoverBackgroundColor: ["#3DA7C8"],
            barThickness: 10,
            borderColor: ["#3DA7C8"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#3DA7C8",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
          {
            data: [this.dentalyearCount],
            label: "Series A",
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 10,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },

        ],

      }



    });
  }

}
