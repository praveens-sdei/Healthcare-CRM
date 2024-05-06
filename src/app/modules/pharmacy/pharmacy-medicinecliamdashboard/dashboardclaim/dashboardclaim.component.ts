import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { PharmacyPlanService } from '../../pharmacy-plan.service';
import { CoreService } from 'src/app/shared/core.service';

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
  selector: 'app-dashboardclaim',
  templateUrl: './dashboardclaim.component.html',
  styleUrls: ['./dashboardclaim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardclaimComponent implements OnInit {

  displayedColumns: string[] = ['claimdate', 'policytype', 'claimamount'];
  dataSource = ELEMENT_DATA;
  pharmacyId: any;
  statusCountData: any;
  selectedinsurance: any = [];
  statusCountDataTotal: any;
  startDate: any;
  endDate: any;
  min: any;
  maxdate:any=Date.now()
  userRole: any;
  userPermission: any;
  innerMenuPremission: any =[];

  constructor(
    private pharmacyPlanService: PharmacyPlanService,
    private coreService: CoreService,
  ) {
    let user = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userPermission = this.coreService.getLocalStorage("loginData").permissions;


    this.userRole = user.role;
    if(this.userRole === "PHARMACY_STAFF"){
      this.pharmacyId = adminData?.for_staff;
    }else{
      this.pharmacyId = user?._id;
    }
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
    this.getStatusCount();
    this.getAllInsurance();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);  
  }

  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){ 
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("health_plan")) {
          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;  
          console.log(`exist in the object.`);
        } else {
          console.log(`does not exist in the object.`);
        }
      }else{
        var checkSubmenu = checkData.submenu;
        let innerMenu = [];
        for (let key in checkSubmenu) {
          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }
        this.innerMenuPremission = innerMenu;
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }

  giveInnerPermission(value){   
    if(this.userRole === "PHARMACY_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }

  @ViewChild('select') select: MatSelect;

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
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {


      if (!item.selected) {

        newStatus = false;
        if (this.selectedinsurance.indexOf(item.value) != -1) {
          this.selectedinsurance.splice(this.selectedinsurance.indexOf(item.value), 1);
        }
      }
      else {
        console.log("tejhgjdksfksd" + item.value, this.selectedinsurance.indexOf(item.value));
        if (this.selectedinsurance.indexOf(item.value) == -1) {
          this.selectedinsurance.push(item.value);
        }
      }
    });
    this.allSelected = newStatus;
    // this.getClaimList();
    this.getStatusCount();
    console.log(this.selectedinsurance, "selectedinsurance");

  }

  private getAllInsurance() {
    const param = {
      page: 1,
      limit: 0,
      searchText: '',
      startDate: '',
      endDate: ''
    }
    this.pharmacyPlanService.getApprovedInsurance(param).subscribe({
      next: async (res) => {
        const encryptedData = await res;


        let result = this.coreService.decryptObjectData(encryptedData);
        console.log('insurance details', result);
        if (result.status) {

          // this.insuraneList = result.body.result;

          result.body.result.map((curentval, index) => {


            this.foods.push({
              viewValue: curentval.company_name,
              value: curentval.for_portal_user._id
            });
          })



        } else {
          this.coreService.showError(result.message, '');
        }

      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
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



  getStatusCount() {
    this.pharmacyPlanService
      .getClaimsStatusCount(this.pharmacyId, this.selectedinsurance.join(","))
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.statusCountData = response?.data;
        this.statusCountDataTotal = this.statusCountData.pending + this.statusCountData.reject + this.statusCountData.approved + this.statusCountData.resubmit + this.statusCountData.preauth;
        console.log("COUNT CLAIMS BY STATUS==============>", response);

      });
  }
  handleDateChage(event)
  {
console.log(event.value);
this.startDate=event.value;
this.min=event.value
this.pharmacyPlanService
.getClaimsStatusCount(this.pharmacyId, this.selectedinsurance.join(","),this.startDate,this.endDate)
.subscribe((res) => {
  let response = this.coreService.decryptObjectData({ data: res });
  this.statusCountData = response?.data;
  this.statusCountDataTotal = this.statusCountData.pending + this.statusCountData.reject + this.statusCountData.approved + this.statusCountData.resubmit + this.statusCountData.preauth;
  console.log("COUNT CLAIMS BY STATUS==============>", response);

});
  }
  handletoDateChange(event)
  {
console.log(event.value);
this.endDate=event.value;
this.maxdate=event.value
this.pharmacyPlanService
.getClaimsStatusCount(this.pharmacyId, this.selectedinsurance.join(","),this.startDate,this.endDate)
.subscribe((res) => {
  let response = this.coreService.decryptObjectData({ data: res });
  this.statusCountData = response?.data;
  this.statusCountDataTotal = this.statusCountData.pending + this.statusCountData.reject + this.statusCountData.approved + this.statusCountData.resubmit + this.statusCountData.preauth;
  console.log("COUNT CLAIMS BY STATUS==============>", response);

});
  }
}
