import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { IndiviualDoctorService } from '../../individual-doctor/indiviual-doctor.service';
import { SuperAdminService } from '../super-admin.service';

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
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminDashboardComponent implements OnInit {

  // constructor(private _coreService: CoreService) {
  //   this._coreService.setMenuInHeader('Dashboard');
  //   this._coreService.setLocalStorage('Dashboard', 'menuTitle');
  // }

  displayedColumns: string[] = ['claimdate', 'policytype', 'claimamount'];
  dataSource = ELEMENT_DATA;
  pageSize: number = 0;
  totalPatientLength: number = 0;
  page: any = 1;
  totalInsuranceLength: number = 0;
  totalPharmacyLength: number = 0;
  totalHospitalLength: number = 0;
  totalindDoctorLength: number = 0;

  totalConsultationLength: number = 0;
  totalF2FLength: number = 0;
  totalOnlineLength: number = 0;
  totalHomeLength: number = 0;
  pieChartLabels: string[] = ['Online', 'Face-to-Face', 'Home Visit'];
  years: number[] = [];
  graphyear: number;
  selectedYear: number;
  onlysubscription: any;
  onlycommision: any;
  onlytotalTransaction: any;
  selectedOption: string; // To store the selected option
  startgraphDate: string;
  endgraphDate: string;

  totaleClaimLength: number = 0;
  totalClaimTaitedLength: number = 0;
  startDateFilter: any="";
  endDateFilter: any="";
  constructor(private fb: FormBuilder,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private _superAdminService: SuperAdminService,
    private service: IndiviualDoctorService,
  ) {
    this.yeardropdown()

    this.selectedOption = 'AllTotal';
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
    this.getPatientList();
    this.getInsuranceList();
    this.getPharmacyList();
    this.getHospitalList();
    this.getIndividualDoctorList();
    this.getConsultationList();
    this.getClaimList(this.startDateFilter,this.endDateFilter); 
    this.getgraphYear(this.years[0])

  }

  @ViewChild('select') select: MatSelect;

  allSelected = false;
  foods: any[] = [
    { value: 'ASCOMA', viewValue: 'ASCOMA' },
    { value: 'Coris', viewValue: 'Coris' },
    { value: 'yelen', viewValue: 'yelen' }
  ];
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
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

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };


  // Revenue Line chart
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [200, 450, 500, 600, 700, 800, 400, 250, 350, 750, 600, 550],
        label: 'Series A',
        tension: 0.5,
        borderColor: '#0B4977',
        backgroundColor: 'white'
      },

    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = false;




  // pie chart
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartDatasets = [{
    data: [25, 60, 35],
    backgroundColor: ['#59E2E5', '#DC79FF', '#284AD0'],
    hoverBackgroundColor: ['#72D284', '#FF7354', '#0B4977'],
    hoverBorderColor: ['#72D284', '#FF7354', '#0B4977'],
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];



  getPatientList(sort: any = '') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      createdDate: "",
      updatedDate: "",
      sort: sort,
      insuranceStatus: ""
    };

    this.service.getAllPatientForSuperAdmin(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // console.log("PATIENT LIST===>", response);
      this.totalPatientLength = response?.body?.totalRecords;
    });
  }

  getInsuranceList() {
    this._superAdminService.getInsuranceforSuperadminDashboard().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // console.log("Insurance LIST===>", response);
      this.totalInsuranceLength = response?.body?.totalCount;
    });
  }

  getPharmacyList() {
    this._superAdminService.getPharmacyforSuperadminDashboard().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // console.log("Insurance LIST===>", response);
      this.totalPharmacyLength = response?.body?.totalCount;
    });
  }

  getHospitalList() {
    this._superAdminService.getHospitalforSuperadminDashboard().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // console.log("Insurance LIST===>", response);
      this.totalHospitalLength = response?.body?.totalCount;
    });
  }

  getIndividualDoctorList() {
    this._superAdminService.getIndiDoctorforSuperadminDashboard().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // console.log("Insurance LIST===>", response);
      this.totalindDoctorLength = response?.body?.totalCount;
    });
  }

  getConsultationList() {
    this._superAdminService.getConsultationDashboard().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      this.totalF2FLength = response?.body?.totalF2FCount;
      this.totalOnlineLength = response?.body?.totalOnlineCount;
      this.totalHomeLength = response?.body?.totalHomeVisitCount;

      this.totalConsultationLength = this.totalF2FLength + this.totalOnlineLength + this.totalHomeLength;

      this.updatePieChart();
    });
  }

  updatePieChart() {
    const dynamicData = [this.totalOnlineLength, this.totalF2FLength, this.totalHomeLength];

    if (dynamicData.every(value => value === 0)) {
      // If all values in dynamicData are 0, display a blank pie chart
      this.pieChartDatasets = [{
        data: [25, 60, 35],
        backgroundColor: ['#59E2E5', '#DC79FF', '#284AD0'],
        hoverBackgroundColor: ['#72D284', '#FF7354', '#0B4977'],
        hoverBorderColor: ['#72D284', '#FF7354', '#0B4977'],
      }];
    } else {
      // Update the pie chart datasets with actual data
      this.pieChartDatasets = [{
        data: dynamicData,
        backgroundColor: ['#284AD0', '#DC79FF', '#59E2E5'],
        hoverBackgroundColor: ['#284AD0', '#DC79FF', '#59E2E5'],
        hoverBorderColor: ['#284AD0', '#DC79FF', '#59E2E5'],
      }];
    }
  }

  getgraphYear(year) {
    this.startgraphDate = year + "-01-01T18:30:00.000Z"
    this.endgraphDate = year + "-12-31T18:30:00.000Z"
    this.gettotalMonthWiseforSuperAdmingraph(this.startgraphDate, this.endgraphDate, 'AllTotal')
  }

  gettotalMonthWiseforSuperAdmingraph(startyearDate, endyearDate, tab?:any) {
    let itsJson = {
      createdDate: startyearDate,
      updatedDate: endyearDate,

    }
    this._superAdminService.gettotalMonthWiseforSuperAdmingraph(itsJson).subscribe(async (res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);


      let allsubscriptionArray = await response.body.allsubscriptionArray;
      let allcommisionArray = await response.body.allcommisionArray;
      let alltotalTransaction = await response.body.alltotalTransaction;

      this.onlysubscription = Object.values(allsubscriptionArray);
      this.onlycommision = Object.values(allcommisionArray);
      this.onlytotalTransaction = Object.values(alltotalTransaction);


    if(tab == 'Subscription'){
      console.log("Subscription api");

      this.lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data:  this.onlysubscription,
            label: 'Series A',
            tension: 0.5,
            borderColor: '#0B4977',
            backgroundColor: 'white'
          },

        ]
      };

    } else if(tab === "Commission") {
      console.log("Commission api");

      this.lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: this.onlycommision,
            label: 'Series A',
            tension: 0.5,
            borderColor: '#0B4977',
            backgroundColor: 'white'
          },

        ]
      };
    } else {
      console.log("all api");

      this.lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: this.onlytotalTransaction,
            label: 'Series A',
            tension: 0.5,
            borderColor: '#0B4977',
            backgroundColor: 'white'
          },

        ]
      };
    }
    }
    )
  }

  onOptionChange() {
    // Handle the option change here
    console.log("this.selectedOption",this.selectedOption);
    
    if (this.selectedOption == 'Subscription') {
      console.log("subscription tab");
   this.gettotalMonthWiseforSuperAdmingraph(this.startgraphDate, this.endgraphDate, 'Subscription')
    } else if (this.selectedOption == 'Commission') {
      console.log("Commission tab");
      this.gettotalMonthWiseforSuperAdmingraph(this.startgraphDate, this.endgraphDate, 'Commission')
    } else if (this.selectedOption == 'AllTotal'){
      this.gettotalMonthWiseforSuperAdmingraph(this.startgraphDate, this.endgraphDate, 'AllTotal')
    }
  }

  handleSelectEndDateFilter(event: any) {    
    this.selectedYear=this.years[""]
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate
    this.getClaimList(this.startDateFilter,this.endDateFilter );

  }

  handleSelectStartDateFilter(event: any) {    
    this.selectedYear=this.years[""]
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate
    console.log( this.startDateFilter," this.startDateFilter " );
    
    this.getClaimList(this.startDateFilter,this.endDateFilter );
  }

  extendDateFormat(mydate){
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30); 
    return mydate
  }

  getClaimList(startyearDate,endyearDate){

    let reqData ={ 
      createdDate: startyearDate,
      updatedDate: endyearDate,
    
    }
    this._superAdminService.getClaimforSuperadminDashboard(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("Claim LIST===>", response);
      this.totaleClaimLength = response?.body?.totalCountClaimSubmitted;
      this.totalClaimTaitedLength = response?.body?.totalCountTreatedInsurance;
    });
  }
}
