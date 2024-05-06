import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ViewChild } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { IndiviualDoctorService } from '../../individual-doctor/indiviual-doctor.service';
import { CoreService } from 'src/app/shared/core.service';
import { start } from 'repl';
import { FourPortalService } from '../four-portal.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-four-portal-revenuemanagement',
  templateUrl: './four-portal-revenuemanagement.component.html',
  styleUrls: ['./four-portal-revenuemanagement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FourPortalRevenuemanagementComponent implements OnInit {
  userRole: any = '';
  portal_id: any = '';
  for_portal_user: any = '';
  doctor_portal_id: any;

  allAppointmentList: any[] = [];
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  selectedStatus: any = "ALL";
  consultationType: any = "ALL";
  dateFilter: any = "";

  todaysTotalLength: number = 0;
  onlineTotalLength: number = 0;
  facetofaceTotalLength: number = 0;
  homeTotallength: number = 0;
  totalPatientLength: number = 0;

  onlineConsultationfee: any;
  public onlineFee: number = 0;
  facetofaceConsultationfee: any;
  public facetofaceFee: number = 0;
  homeConsultationfee: any;
  homeFee: number = 0;
  allConsultationfee: any;
  allFee: number = 0;
  totalCountForGraph: any;
  pieChartLabels: string[] = ['Online', 'Face-to-Face', 'Home Visit'];

  F2FCoPay: any = 0;
  F2FInsuranceToBePaid: any = 0;

  OnlineCoPay: any = 0;
  OnlineInsuranceToBePaid: any = 0;

  HomeVisitCoPay: any = 0;
  HomeVisitInsuranceToBePaid: any = 0;

  years: number[] = [];
  selectedYear: number;
  selectedDate: any = '';
  liveYear: any = '';

  startDate: any = '';
  endDate: any = '';

  f2fTotalCoPay: any = 0;
  f2fTotalInsuranceToBePaid: any = 0;
  f2fYearFilter: any = '';

  onlineTotalCoPay: any = 0;
  onlineTotalInsuranceToBePaid: any = 0;
  filterDateWiseOnline: any = '';

  route_type: any = '';

  totalTestsCount: any = 0
  onlineAppCount: any = 0;
  homeVisitAppCount: any = 0;
  f2fAppCount: any = 0;

  totalf2fRevenue: any = 0;
  totalOnlineRevenue: any = 0;
  totalHomeVisitRevenue: any = 0;
  totalRevenue: any = 0;

  login_portal_id: any; 
  innerMenuPremission:any=[];
  loginrole: any;
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  constructor(
    private _coreService: CoreService,
    private service: IndiviualDoctorService,
    private route: Router,
    private act_route: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private loader: NgxUiLoaderService,
    private modalService: NgbModal
  ) {
    this.yeardropdown();

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    // this.login_portal_id = loginData?._id;
    this.userRole = loginData?.role;

    if (
      this.userRole === "INDIVIDUAL" ||
      this.userRole === "HOSPITAL"
    ) {
      this.portal_id = loginData?._id;
    } else {
      this.portal_id = adminData?.creatorId;
    }

  }

  yeardropdown() {
    const currentYear = new Date().getFullYear();
    this.liveYear = currentYear
    this.f2fYearFilter = currentYear
    this.startDate = this.liveYear + "-01-01T18:30:00.000Z"
    this.endDate = this.liveYear + "-12-31T18:30:00.000Z"
    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }

    this.selectedYear = currentYear;
    //this.graphyear=currentYear;
  }

  ngOnInit(): void {

    this.act_route.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });
    console.log("this.route_type----", this.route_type);

   

    this.testsCountOfAllApptypes();

    this.getAppointmentRevenuesCount();
    this.getTotalRevenueMontwiseF2FForGraph(this.startDate, this.endDate);
    this.getTotalRevenueMontwiseOnlineForGraph(this.startDate, this.endDate);

    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    console.log("chck_________________")
    let userPermission = this._coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("about_us")) {
          this.innerMenuPremission = checkSubmenu['about_us'].inner_menu;
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
        console.log("this.innerMenuPremission ______________",this.innerMenuPremission );
        
      }
    }  
  }

  giveInnerPermission(value) {
    if (this.userRole === 'STAFF' || this.userRole === 'HOSPITAL_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  getTotalRevenueMontwiseOnlineForGraph(startDate: any, endDate: any) {
    let data = {
      doctor_portal_id: this.portal_id,
      createdDate: startDate,
      updatedDate: endDate,
      filterDateWise: this.filterDateWiseOnline,
      portalType: this.route_type
    }

    this.fourPortalService.getfourPortalTotalRevenueMonthwiseOnline(data).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response--->>>>>>>>",response)

      this.onlineTotalCoPay = Object.values(response.body.monthlyCountCoPay);
      this.onlineTotalInsuranceToBePaid = Object.values(response.body.monthlyCountInsuranceToBePaid);

      console.log(this.onlineTotalCoPay, "responseOnlinee____", this.onlineTotalInsuranceToBePaid);

      this.lineChartData = {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'Aug',
          'Sept',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            data: this.onlineTotalCoPay,
            fill: false,
            tension: 0.5,
            borderColor: '#0B4977',
            pointRadius: 0,
          },
          {
            data: this.onlineTotalInsuranceToBePaid,
            fill: false,
            tension: 0.5,
            borderColor: '#3DA7C8',
            pointRadius: 0,
          }
        ]
      };

    })
  }

  getYear(year: any) {
    this.selectedYear = year;
    console.log(this.selectedYear, "yearrrrr________");
    this.getAppointmentRevenuesCount();
  }

  getSelectedDate(event: any) {
    this.selectedDate = event.target.value;
    this.getAppointmentRevenuesCount();
    this.testsCountOfAllApptypes();
    console.log(this.selectedDate, "dateSelectedd_");
  }

  getDateToFilterOnline(event: any) {
    this.filterDateWiseOnline = event.value;
    console.log("this.filterDateWiseOnline-->>>",this.filterDateWiseOnline)
    this.getTotalRevenueMontwiseOnlineForGraph(this.startDate, this.endDate)
  }

  getAppointmentRevenuesCount() {
    let data = {
      doctor_portal_id: this.portal_id,
      yearFilter: this.selectedYear,
      dateFilter: this.selectedDate,
      portalType: this.route_type
    }
    this.loader.start();
    this.fourPortalService.fourPortalappointmentRevenuesCount(data).subscribe((res: any) => {
      // let encryptedData = { data: res }.data;
      let response = this._coreService.decryptObjectData({data:res});
      console.log(response, "responseee__");
      if(response?.status){
        this.loader.stop();
        this.F2FCoPay = response?.data?.F2FCoPay ? response?.data?.F2FCoPay : 0;
        this.F2FInsuranceToBePaid = response?.data?.F2FInsuranceToBePaid ? response?.data?.F2FInsuranceToBePaid : 0;
  
        this.OnlineCoPay = response?.data?.OnlineCoPay ? response?.data?.OnlineCoPay : 0;
        this.OnlineInsuranceToBePaid = response?.data?.OnlineInsuranceToBePaid ? response?.data?.OnlineInsuranceToBePaid : 0;
  
        this.HomeVisitCoPay = response?.data?.HomeVisitCoPay ? response?.data?.HomeVisitCoPay : 0;
        this.HomeVisitInsuranceToBePaid = response?.data?.HomeVisitInsuranceToBePaid ? response?.data?.HomeVisitInsuranceToBePaid : 0;
      }else{
        this.loader.stop();
      }
    })
  }

  filterF2FYear(year: any) {
    this.f2fYearFilter = year
    console.log(this.f2fYearFilter, "yearrrr____");
    this.getTotalRevenueMontwiseF2FForGraph(this.startDate, this.endDate);
  }

  getTotalRevenueMontwiseF2FForGraph(startDate: any, endDate: any) {
    let data = {
      doctor_portal_id: this.portal_id,
      createdDate: startDate,
      updatedDate: endDate,
      yearFilter: this.selectedYear,
      f2fYearFilter: this.f2fYearFilter,
      portalType: this.route_type
    }
    this.fourPortalService.getfourPortalTotalRevenueMonthwiseF2F(data).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      this.f2fTotalCoPay = Object.values(response.body.monthlyCountCoPay);
      this.f2fTotalInsuranceToBePaid = Object.values(response.body.monthlyCountInsuranceToBePaid);

      console.log(this.f2fTotalCoPay, "responseFFF22FFF____", this.f2fTotalInsuranceToBePaid);

      this.monthbarChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: this.f2fTotalCoPay,
            label: 'Series A',
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 25,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: 'y-axis-r',
          },
          {
            data: this.f2fTotalInsuranceToBePaid,
            label: 'Series B',
            backgroundColor: ["#3DA7C8"],
            hoverBackgroundColor: ["#3DA7C8"],
            barThickness: 25,
            borderColor: ["#3DA7C8"],
            borderWidth: 1,
            borderRadius: 15,
            hoverBorderColor: "#3DA7C8",
            hoverBorderWidth: 0,
            yAxisID: 'y-axis-r',
          },
        ],
      };

    })
  }


  // public pieChartDatasets: any;
  public pieChartDatasets = [
    {
      data: [40, 20, 10],
      backgroundColor: ["#1BEDD4", "#4880FF", "#FF6069"],
      hoverBackgroundColor: ["#1BEDD4", "#4880FF", "#FF6069"],
      hoverBorderColor: ["#1BEDD4", "#4880FF", "#FF6069"],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  

  // testsCountOfAllApptypes() {
  //   let data = {
  //     portalType: this.route_type,
  //     four_portal_id: this.portal_id
  //   }
  //   this.fourPortalService.getRevenueForAlltypeAppointment(data).subscribe((res: any) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.onlineFee = response?.data?.totalOnlineRevenue;
  //     this.facetofaceFee = response?.data?.totalF2FRevenue;
  //     this.homeFee = response?.data?.totalHomeVisitRevenue;
  //     this.allFee = this.onlineFee + this.facetofaceFee + this.homeFee;

  //     const dynamicData =[this.homeFee,this.facetofaceFee, this.onlineFee];

  //     if (dynamicData.every(value => value === 0)) {
  //       // If all values in dynamicData are 0, display a blank pie chart
  //       this.pieChartLabels = ['No Data'];
  //        this.pieChartDatasets = [
  //           {
  //             data: [1], // Placeholder value of 1
  //             backgroundColor: ['#EAEAEA'], // Placeholder color
  //           },
  //         ]; 
  //     } else {
  //       // Update the pie chart datasets with actual data
  //       this.pieChartLabels = ['Online', 'Face-to-Face', 'Home Visit'];
  //       this.pieChartDatasets = [
  //          {
  //            data: dynamicData,
  //            backgroundColor: ['#1BEDD4', '#4880FF', '#FF6069'],
  //            hoverBackgroundColor: ['#1BEDD4', '#4880FF', '#FF6069'],
  //            hoverBorderColor: ['#1BEDD4', '#4880FF', '#FF6069'],
  //          },
  //        ]; 
  //     }

  //     // this.pieChartDatasets = [
  //     //   {
  //     //     data: 
  //     //     backgroundColor: ['#1BEDD4', '#4880FF', '#FF6069'],
  //     //     hoverBackgroundColor: ['#1BEDD4', '#4880FF', '#FF6069'],
  //     //     hoverBorderColor: ['#1BEDD4', '#4880FF', '#FF6069'],
  //     //   },
  //     // ]; 
  //   })
  // }

  testsCountOfAllApptypes() {
    let data = {
      portalType: this.route_type,
      four_portal_id: this.portal_id,
      dateFilter: this.selectedDate
    }
    this.fourPortalService.getTotalTests(data).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      this.totalTestsCount = response?.data?.totalTestsCountInfo?.length;
      this.onlineAppCount = response?.data?.onlineAppointments?response?.data?.onlineAppointments:this.onlineAppCount;
      this.homeVisitAppCount = response?.data?.homeVisitAppointments?response?.data?.homeVisitAppointments:this.homeVisitAppCount;
      this.f2fAppCount = response?.data?.f2fAppointments?response?.data?.f2fAppointments:this.f2fAppCount;

      this.totalf2fRevenue = response?.data?.appointmentsRevenue?.totalF2FRevenue?response?.data?.appointmentsRevenue?.totalF2FRevenue:this.totalf2fRevenue;
      this.totalOnlineRevenue = response?.data?.appointmentsRevenue?.totalOnlineRevenue?response?.data?.appointmentsRevenue?.totalOnlineRevenue:this.totalOnlineRevenue;
      this.totalHomeVisitRevenue = response?.data?.appointmentsRevenue?.totalHomeVisitRevenue?response?.data?.appointmentsRevenue?.totalHomeVisitRevenue:this.totalHomeVisitRevenue;

      this.totalRevenue = this.totalf2fRevenue + this.totalOnlineRevenue + this.totalHomeVisitRevenue;
      // console.log(response, "responseee__e", response?.data?.appointmentsRevenue);

      this.pieChartDatasets = this.areAllValuesZeroOrUndefined([this.totalHomeVisitRevenue, this.totalf2fRevenue, this.totalOnlineRevenue])
        ? []
        : [
          {
            data: [this.totalHomeVisitRevenue, this.totalf2fRevenue, this.totalOnlineRevenue],
            backgroundColor: ["#1BEDD4", "#4880FF", "#FF6069"],
            hoverBackgroundColor: ["#1BEDD4", "#4880FF", "#FF6069"],
            hoverBorderColor: ["#1BEDD4", "#4880FF", "#FF6069"],
          },
        ];

    })
  }

  areAllValuesZeroOrUndefined(arr: number[]): boolean {
    return arr.every(value => value === 0 || value === undefined);
  }

    // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    // labels: [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ],
    datasets: [{
      data: [300, 500, 200],
      backgroundColor: ['#FF6069', '#4880FF', '#1BEDD4'],
    }]
  };
  
  public pieChartType: ChartType = 'pie';


  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [100, 50, 20, 150, 10, 120, 100, 50, 0, 150, 56, 88,],
        fill: false,
        tension: 0.5,
        borderColor: '#0B4977',
        pointRadius: 0,
      },
      {
        data: [10, 20, 50, 90, 50, 10, 80, 50, 0, 10, 66, 88,],
        fill: false,
        tension: 0.5,
        borderColor: '#3DA7C8',
        pointRadius: 0,
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = false;


  //Month Bar chart
  public monthbarChartLegend = false;
  public monthbarChartPlugins = [];
  public monthbarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [30, 35, 25, 50, 40, 35, 75, 60, 45, 55, 30, 25],
        label: 'Series A',
        backgroundColor: ["#0B4977"],
        hoverBackgroundColor: ["#0B4977"],
        barThickness: 25,
        borderColor: ["#0B4977"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#0B4977",
        hoverBorderWidth: 0,
        yAxisID: 'y-axis-r',
      },
      {
        data: [20, 45, 15, 25, 45, 65, 50, 45, 55, 35, 15, 20],
        label: 'Series B',
        backgroundColor: ["#3DA7C8"],
        hoverBackgroundColor: ["#3DA7C8"],
        barThickness: 25,
        borderColor: ["#3DA7C8"],
        borderWidth: 1,
        borderRadius: 15,
        hoverBorderColor: "#3DA7C8",
        hoverBorderWidth: 0,
        yAxisID: 'y-axis-r',
      },
    ],
  };
  public monthbarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  closePopup() {
    this.modalService.dismissAll("close");
  }

  openVerticallyCenteredlinechartpopup(linechartpopup: any) {
    this.modalService.open(linechartpopup, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
    });
  }

  openVerticallyCenteredpiechartpopup(claimlistpopup: any) {
    this.modalService.open(claimlistpopup, {
      centered: true,
      size: "md",
      windowClass: "edit_staffnew",
    });
  }
}
