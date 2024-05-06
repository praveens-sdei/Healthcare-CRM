import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PharmacyService } from '../pharmacy.service';
import { CoreService } from 'src/app/shared/core.service';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pharmacy-dashboard',
  templateUrl: './pharmacy-dashboard.component.html',
  styleUrls: ['./pharmacy-dashboard.component.scss']
})
export class PharmacyDashboardComponent implements OnInit {

  userID: string = "";
  orderCount: any;
  TotalorderCount: any;
  scheduledCount: any;
  cancelledCount: any;
  pickupCount: any;
  completedData: any;
  rejectedData: any;

  years: number[] = [];
  selectedYear: number;
  graphyear: number;
  yearFilter: any = '';
  directPayment: number = 0;
  pendingClaimAmount: number = 0;
  approvedClaimAmount: number = 0;
  CopayAmount: number = 0;
  directPaymentGraph: any;
  coPaymentGraph: any;
  insuredGraph: any;

  constructor(private service: PharmacyService, private _coreService: CoreService, private route: Router, private modalService: NgbModal,) {

    this.yeardropdown();
  }

  ngOnInit(): void {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.getallcountList();
    this.getClaimAmount();
    this.getOrderCopayment();
    if (this.years.length > 0) {

      this.getYear(this.years[0]);


    }

  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  async checkForPlan() {
    let isPurchased = await this.service.isPlanPurchasedByPharmacy(
      this.userID
    );

    if (!isPurchased) {
      this._coreService.showError(
        "No plan purchsed! Please purches new plan",
        ""
      );
      this.route.navigate(["/pharmacy/pharmacysubscriptionplan"]);
    }
  }


  getallcountList() {
    let reqData = {
      for_portal_user: this.userID,
      // dateFilter: this.dateFilter
    };

    this.service.getTotalCounts(reqData).subscribe(async (res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("response,", response);
      if (response.status == true) {

        this.TotalorderCount = response?.data?.totalOrder;
        this.scheduledCount = response?.data?.totalScheduled;
        this.cancelledCount = response?.data?.cancelled;
        this.pickupCount = response?.data?.pickUp;
      }

    });
  }

  yeardropdown() {
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }

    this.selectedYear = currentYear;
    this.graphyear = currentYear;
  }
  getYear(year) {
    this.yearFilter = year;
    this.lineGraph()
  }

  lineGraph() {
    let reqData = {
      for_portal_user: this.userID,
      yearFilter: this.yearFilter
    };

    this.service.getdashboardLineGraph(reqData).subscribe(async (res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        console.log("response___________", response);

        this.completedData = response.data.completed;
        this.rejectedData = response.data.rejected;

        this.lineChartData = {
          labels: ['January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',],
          datasets: [
            {
              data: this.completedData,
              fill: false,
              tension: 0.5,
              borderColor: '#1fdcae',
              pointBackgroundColor: '#fff',
              pointBorderColor: '#1fdcae',
              pointRadius: 8,
            },
            {
              data: this.rejectedData,
              fill: false,
              tension: 0.5,
              borderColor: '#e72727',
              pointBackgroundColor: '#fff',
              pointBorderColor: '#e72727',
              pointRadius: 8,
            },

          ]
        };
      }

    });
  }

  openVerticallyCenteredclaimlistpopup(linegraph: any) {
    this.modalService.open(linegraph, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
    });
  }


  closePopup() {
    this.modalService.dismissAll("close");
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [

    ],
    datasets: [
      {
        data: [],
        fill: false,
        tension: 0.5,
        borderColor: '#0B4977',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0B4977',
        pointRadius: 8,
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = false;

  // Bar chart
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartDatasets = [{
    data: [],
    backgroundColor: ['#1BEDD4', '#FF6069', '#4880FF'],
    // hoverBackgroundColor: ['#1BEDD4', '#FF6069', '#4880FF'],
    // hoverBorderColor: ['#1BEDD4', '#FF6069', '#4880FF'],
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];


  getClaimAmount() {
    let reqData = {
      pharmacyId: this.userID,
      createdDate: "",
      updatedDate: "",
    };

    this.service.getAllClaimRevenue(reqData).subscribe(async (res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response________", response)

      await this.getOrderCopayment();
      if (response.status) {
        this.pendingClaimAmount = response?.data?.alltotalRequestedAmount;
        this.approvedClaimAmount = response?.data?.alltotalApprovedAmount;
        this.CopayAmount = response?.data?.alltotalCoPayment;
        this.coPaymentGraph = Object.values(response?.data?.monthlyCoPayment);
        this.insuredGraph = Object.values(response?.data?.monthlyInsuredPayment);

        this.pieChartDatasets = [
          {
            data: [this.approvedClaimAmount, this.directPayment, this.CopayAmount],
            backgroundColor: ['#4880FF', '#1BEDD4', '#FF6069'],
            // hoverBackgroundColor: ['#1BEDD4', '#FF6069', '#4880FF'],
            // hoverBorderColor: ['#1BEDD4', '#FF6069', '#4880FF'],
          }
        ]

      }

    }
    );
  }

  getOrderCopayment() {
    let reqData = {
      pharmacyId: this.userID,
      createdDate: "",
      updatedDate: ""
    };

    this.service.getTotalCopayment(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response11111________", response)
      if (response.status) {
        this.directPayment = response?.data?.allco_payment;


      }
    }
    );
  }

  openVerticallyCenteredpiechartpopup(piechartpopup: any) {
    this.modalService.open(piechartpopup, {
      centered: true,
      size: "md",
      windowClass: "edit_staffnew",
    });
  }
}
