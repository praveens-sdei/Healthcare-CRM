import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { SuperAdminService } from '../../super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/modules/patient/patient.service';

export interface PeriodicElement {
  claimdate: string;
  policytype: string;
  claimamount: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA' },
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA' },
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA' },
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA' },
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA' },
];

@Component({
  selector: 'app-super-admin-dashboardclaim',
  templateUrl: './super-admin-dashboardclaim.component.html',
  styleUrls: ['./super-admin-dashboardclaim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminDashboardclaimComponent implements OnInit {

  displayedColumns: string[] = ['claimdate', 'policytype', 'claimamount'];
  dataSource = ELEMENT_DATA;
  pharmacyArray: any[] = [];
  insuranceArray: any[] = [];
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  groupID: any;
  startDate: string = null;
  endDate: string = null;
  selectedId: any[] = [];
  selectedId1: any[] = [];
  allSelected1 = false;


  constructor(
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private route: Router,
    private service: PatientService
  ) {
    const loginData = this.coreService.getLocalStorage('loginData');
    const adminData = this.coreService.getLocalStorage('adminData');
    console.log(loginData._id);
    this.groupID = adminData._id
    this.viewAssociationGroup();
  }

  // Bar chart
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Medical Consultation', 'Medicine', 'Hospitalization'],
    datasets: [
      {
        data: [80, 60, 75],
        label: 'Series A',
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#D9EFFF"],
        barThickness: 40,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 10,
        hoverBorderColor: "#D9EFFF",
        hoverBorderWidth: 0,
        yAxisID: 'y-axis-r',
      },

    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };


  ngOnInit(): void {
  }
  @ViewChild('select') select: MatSelect;
  @ViewChild('selectinsurance') selectinsurance: MatSelect;


  allSelected = false;
  foods: any[] = [
    // { value: 'ASCOMA', viewValue: 'ASCOMA' },
    // { value: 'Coris', viewValue: 'Coris' },
    // { value: 'yelen', viewValue: 'yelen' }
  ];
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
    this.filterData();
  }

  toggleAllSelection1() {
    if (this.allSelected1) {
      this.selectinsurance.options.forEach((item: MatOption) => item.select());
      // this.filterData();
    } else {
      this.selectinsurance.options.forEach((item: MatOption) => item.deselect());
      // this.filterData();
    }
    this.filterData();
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  optionClick1() {

    this.selectedId1 = [];

    let newStatus = true;
    this.selectinsurance.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;

      }
      if (item.selected) {
        this.selectedId1.push(
          item.value
        )
      }
    });
    this.allSelected1 = newStatus;
    this.filterData();


  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // pie chart
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartDatasets = [{
    data: [40, 20, 10, 20, 10,],
    backgroundColor: ['#72D284', '#FF7354', '#0B4977', '#FFB71B', '#447FD9'],
    hoverBackgroundColor: ['#72D284', '#FF7354', '#0B4977', '#FFB71B', '#447FD9'],
    hoverBorderColor: ['#72D284', '#FF7354', '#0B4977', '#FFB71B', '#447FD9'],
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //  Line chart
  // public lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: [
  //     '10/15/2022',
  //     '10/18/2022',
  //     '10/20/2022',
  //     '10/26/2022',
  //     '10/26/2022',
  //     '10/26/2022'
  //   ],
  //   datasets: [
  //     {
  //       data: [0, 200,150, 170,300, 350],
  //       label: 'Series A',
  //       fill: false,
  //       tension: 0.6,
  //       borderWidth:1,
  //       borderColor: '#1EA7FF',
  //       pointBackgroundColor: '#1EA7FF',
  //       pointHoverBorderColor: '#1EA7FF'
  //     },
  //     {
  //       data: [0, 20,10, 190,500, 50],
  //       label: 'Series A',
  //       fill: false,
  //       tension: 0.4,
  //       borderWidth:1,
  //       borderColor: '#1EA7FF',
  //       pointBackgroundColor: '#1EA7FF',
  //       pointHoverBorderColor: '#1EA7FF'
  //     },
  //     {
  //       data: [0, 100,50, 70,230, 290],
  //       label: 'Series A',
  //       fill: false,
  //       tension: 0.8,
  //       borderWidth:1,
  //       borderColor: '#1EA7FF',
  //       pointBackgroundColor: '#1EA7FF',
  //       pointHoverBorderColor: '#1EA7FF'
  //     }
  //   ]
  // };
  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: true
  // };
  // public lineChartLegend = false;


  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        tension: 0.5,
        borderColor: '#3DA7C8',
        backgroundColor: 'white'
      },
      {
        data: [5, 29, 50, 91, 36, 75, 30],
        label: 'Series A',
        tension: 0.5,
        borderColor: '#FF7354',
        backgroundColor: 'white'
      },
      {
        data: [25, 39, 70, 61, 56, 5, 50],
        label: 'Series A',
        tension: 0.5,
        borderColor: '#1BDCAE',
        backgroundColor: 'white'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = false;

  filterData() {
    console.log('hiiiiiii');

    console.log(this.startDate, 'startdate');
    console.log(this.endDate, 'enddate');
    console.log(this.selectedId, 'all selected');
    // this.getClaimList();

  }


  // getClaimList() {
  //   let reqData = {
  //     status: '',
  //     pharmacyIds: this.selectedId.join(","),
  //     insuranceIds: this.selectedId1.join(","),
  //     limit: this.pageSize,
  //     page: this.page,
  //     fromdate: this.startDate,
  //     todate: this.endDate,
  //   };
  //   this.superAdminService.medicineClaimList(reqData).subscribe((res) => {

  //     let response = this.coreService.decryptObjectData({ data: res });
  //     console.log("All Medicine claims ---->", response);
  //     this.dataSource = response?.data?.result;
  //     this.totalLength = response?.data?.totalRecords;

  //   });
  // }

  getInsuranceList() {
    this.service.getInsuanceList().subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      console.log(response.body?.result);
      // this.insuranceList = response.body.result;

      for (let insurance of response.body?.result) {
        this.insuranceArray.push({ value: insurance.for_portal_user._id, viewValue: insurance.company_name })
        this.selectedId1.push(
          insurance.for_portal_user._id
        )
      }
      console.log(this.insuranceArray, "hjdhkjhd");
      this.filterData();
    });

  }

  viewAssociationGroup() {
    this.superAdminService.viewAssociationGroup(this.groupID).subscribe((res) => {

      let response = this.coreService.decryptObjectData(res);



      for (let pharmacy of response.data[1]?.pharmacy_details) {
        this.pharmacyArray.push({ value: pharmacy.portal_user_id, viewValue: pharmacy.pharmacy_name })
        this.selectedId.push(
          pharmacy.portal_user_id
        )
        // this.selectedPharmacy.push(pharmacy.portal_user_id);
      }
      this.getInsuranceList();

    });

  }
}
