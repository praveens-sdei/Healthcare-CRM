import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import {  ViewChild } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
@Component({
  selector: 'app-hospital-revenuemanagement',
  templateUrl: './hospital-revenuemanagement.component.html',
  styleUrls: ['./hospital-revenuemanagement.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class HospitalRevenuemanagementComponent implements OnInit {

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  userId: any;
  userRole: any;
  userPermission: any;
  innerMenuPremission:any=[];
  dateFilter: any = '';

  F2FCoPay: any = 0;
  F2FInsuranceToBePaid: any = 0;

  OnlineCoPay: any = 0;
  OnlineInsuranceToBePaid: any = 0;

  HomeVisitCoPay: any = 0;
  HomeVisitInsuranceToBePaid: any = 0;

  totalOnlineDoctorFees : any = 0;
  totalF2FDoctorFees : any = 0;
  totalHomeDoctorFees : any = 0;
  allAppointmentFees : any = 0;

  totalOnlineFourPortalFees:any = 0;
  totalF2FFourPortalFees : any =0;
  totalHomeFourPortalFees: any =0;
  allFourPortalAppointmentFees: any=0;
  allDoctorAppointmentFees: any=0;
  allF2Ffees:any=0;
  allOnlinefees:any=0;
  allhomevisitfees:any=0;
  filterDateWiseOnline: any = '';
  onlineTotalCoPay:any;
  onlineTotalInsuranceToBePaid:any;
  f2fTotalCoPay: any;
  f2fTotalInsuranceToBePaid:any;
  years: number[] = [];
  graphYear : any;
  yearFilter : any = new Date().getFullYear();
  constructor(private _coreService: CoreService,private _hospitalService: HospitalService,  private modalService: NgbModal,
    private router: Router,) {
    const userData = this._coreService.getLocalStorage("loginData");
    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole =userData?.role;
    if(this.userRole === "HOSPITAL_STAFF"){
      this.userId = admindata?.in_hospital;

    }else{
      this.userId = userData?._id;
    }
    this.userPermission = userData?.permissions;
    this.yeardropdown()
   }

  ngOnInit(): void {
    this.getallrevenueList();
    this.getallOnlinerevenue();
    this.getallf2frevenue();
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
    if(this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }


  getallrevenueList() {
    let reqData = {
      hospital_id: this.userId,
      dateFilter: this.dateFilter,
      yearFilter : this.yearFilter
    };

    this._hospitalService.getHospitalRevenueCount(reqData).subscribe(async(res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE==========>", response);
      this.F2FCoPay = response?.data?.totalRevenueAmount.totalF2FCopay
      ? response?.data?.totalRevenueAmount?.totalF2FCopay
      : this.F2FCoPay;
      this.F2FInsuranceToBePaid = response?.data?.totalRevenueAmount?.totalF2FInsurance ? response?.data?.totalRevenueAmount?.totalF2FInsurance:this.F2FInsuranceToBePaid;

      this.OnlineCoPay = response?.data?.totalRevenueAmount?.totalOnlineCopay?response?.data?.totalRevenueAmount?.totalOnlineCopay:this.OnlineCoPay;
      this.OnlineInsuranceToBePaid = response?.data?.totalRevenueAmount?.totalOnlineInsurance?response?.data?.totalRevenueAmount?.totalOnlineInsurance:this.OnlineInsuranceToBePaid;

      this.HomeVisitCoPay = response?.data?.totalRevenueAmount?.totalHomeVisitCopay?response?.data?.totalRevenueAmount?.totalHomeVisitCopay:this.HomeVisitCoPay;
      this.HomeVisitInsuranceToBePaid = response?.data?.totalRevenueAmount?.totalHomevisitInsurance?response?.data?.totalRevenueAmount?.totalHomevisitInsurance:this.HomeVisitInsuranceToBePaid;


      response?.data?.data?.forEach(doctorData => {
        if (doctorData?.appointments?.appointmentType === 'ONLINE') {
          const onlineDoctorFees = doctorData?.appointments?.paymentDetails?.doctorFees || 0;
          this.totalOnlineDoctorFees += parseFloat(onlineDoctorFees);
        }

        if (doctorData?.appointments?.appointmentType === 'FACE_TO_FACE') {
          const f2fDoctorFees = doctorData?.appointments?.paymentDetails?.doctorFees || 0;
          this.totalF2FDoctorFees += parseFloat(f2fDoctorFees);
        }

        if (doctorData?.appointments?.appointmentType === 'HOME_VISIT') {
          const homeDoctorFees = doctorData?.appointments?.paymentDetails?.doctorFees || 0;
          this.totalHomeDoctorFees += parseFloat(homeDoctorFees);
        }
      });

      this.allDoctorAppointmentFees = this.totalOnlineDoctorFees + this.totalHomeDoctorFees + this.totalF2FDoctorFees;

      response?.data?.fourportalData?.data.forEach(fourPortalData => {
        if (fourPortalData?.appointments?.appointmentType === 'ONLINE') {
          const onlineFourPortalFees = fourPortalData?.appointments?.paymentDetails?.doctorFees || 0;
          this.totalOnlineFourPortalFees += parseFloat(onlineFourPortalFees);
        }

        if (fourPortalData?.appointments?.appointmentType === 'FACE_TO_FACE') {
          const f2fFourPortalFees = fourPortalData?.appointments?.paymentDetails?.doctorFees || 0;
          this.totalF2FFourPortalFees += parseFloat(f2fFourPortalFees);
        }

        if (fourPortalData?.appointments?.appointmentType === 'HOME_VISIT') {
          const homeFourPortalFees = fourPortalData?.appointments?.paymentDetails?.doctorFees || 0;
          this.totalHomeFourPortalFees += parseFloat(homeFourPortalFees);
        }
      });

      this.allFourPortalAppointmentFees = this.totalF2FFourPortalFees + this.totalOnlineFourPortalFees + this.totalHomeFourPortalFees;


      this.allF2Ffees =this.totalF2FDoctorFees + this.totalF2FFourPortalFees;
      this.allOnlinefees = this.totalOnlineDoctorFees + this.totalOnlineFourPortalFees;
      this.allhomevisitfees =  this.totalHomeDoctorFees +  this.totalHomeFourPortalFees;
      this.allAppointmentFees =  this.allDoctorAppointmentFees + this.allFourPortalAppointmentFees;

 

      this.pieChartDatasets = this.areAllValuesZeroOrUndefined([this.allF2Ffees, this.allOnlinefees, this.allhomevisitfees])
      ? null
      : [
        {
          data: [this.allF2Ffees, this.allOnlinefees, this.allhomevisitfees],
          backgroundColor: ['#4880FF', '#1BEDD4','#FF6069'],
        },
      ];
    });
  }

  getallOnlinerevenue() {
    let reqData = {
      hospital_id: this.userId,
      filterDateWise: this.filterDateWiseOnline,
      dateFilter : this.dateFilter,
      yearFilter:this.yearFilter
    };

    this._hospitalService.getHospitalOnlineRevenueCount(reqData).subscribe(async(res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE___________>", response);

      this.onlineTotalCoPay= Object.values(response?.data?.monthlyCountCoPay);
      this.onlineTotalInsuranceToBePaid = Object.values(response?.data?.monthlyCountInsuranceToBePaid);
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
    });
  }

  getallf2frevenue() {
    let reqData = {
      hospital_id: this.userId,
      filterDateWise: this.filterDateWiseOnline,
      yearFilter:this.yearFilter
    };

    this._hospitalService.getHospitalf2fRevenueCount(reqData).subscribe(async(res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE11___________>", response);

      this.f2fTotalCoPay= Object.values(response?.data?.monthlyCountCoPay);
      this.f2fTotalInsuranceToBePaid = Object.values(response?.data?.monthlyCountInsuranceToBePaid);
      this.monthbarChartData = {
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

          { data:  this.f2fTotalCoPay,
            label: 'Series A',
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 25,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius:15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: 'y-axis-r', 
           },
           { data: this.f2fTotalInsuranceToBePaid ,
             label: 'Series B',
             backgroundColor: ["#3DA7C8"],
             hoverBackgroundColor: ["#3DA7C8"],
             barThickness: 25,
             borderColor: ["#3DA7C8"],
             borderWidth: 1,
             borderRadius:15,
             hoverBorderColor: "#3DA7C8",
             hoverBorderWidth: 0,
             yAxisID: 'y-axis-r', 
            },
        ]
      };
    });
  }

  areAllValuesZeroOrUndefined(arr: number[]): boolean {
    return arr.every(value => value === 0 || value === undefined);
  }
  
  getDateToFilterOnline(event: any) {
    this.filterDateWiseOnline = event.value;
    this.getallOnlinerevenue();
    this.getallf2frevenue();
    
  }

  yeardropdown() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }
    this.graphYear = currentYear;
  }

  getGraphYear (value : any) {
    this.yearFilter = value;
    this.dateFilter = ""
    this.filterDateWiseOnline = ""
    this.getallrevenueList();
    this.getallOnlinerevenue();
    this.getallf2frevenue();
  }

  getGraphYearForf2f (value : any) {
    this.yearFilter = value;
    this.dateFilter = ""
    this.filterDateWiseOnline = ""
    this.getallf2frevenue();
  }

  getSelectedDate(event: any) {
    console.log(event.value, "selectedDatee___");
    this.dateFilter = event.value;
    this.yearFilter = ""
    this.filterDateWiseOnline = ""
  this.getallrevenueList();
  this.getallOnlinerevenue();
  this.getallf2frevenue();
    
  
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }
  openVerticallyCenteredclaimlistpopup(claimlistpopup: any) {  
    this.modalService.open(claimlistpopup, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
        });

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
  datasets: [ {
    data: [ 300, 500, 200 ],
    backgroundColor: ['#FF6069', '#4880FF', '#1BEDD4'],
    
  }]
  
};

public pieChartDatasets = [
  {
    data: [40, 20, 10],
    backgroundColor: ["#1BEDD4", "#4880FF", "#FF6069"],
  },
];
public pieChartLegend = true;
public pieChartPlugins = [];
public pieChartType: ChartType = 'pie';
 

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
     
    ],
    datasets: [
      {
        data: [],
        fill: false,
        tension: 0.5,
        borderColor: '#0B4977',
        pointRadius: 0,
      },
      {
        data: [],
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
    labels: [ 'Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      { data: [ 30,35,25,50,40,35,75,60,45,55,30,25 ],
         label: 'Series A',
         backgroundColor: ["#0B4977"],
         hoverBackgroundColor: ["#0B4977"],
         barThickness: 25,
         borderColor: ["#0B4977"],
         borderWidth: 1,
         borderRadius:15,
         hoverBorderColor: "#0B4977",
         hoverBorderWidth: 0,
         yAxisID: 'y-axis-r', 
        },
        { data: [ 20,45,15,25,45,65,50,45,55,35,15,20 ],
          label: 'Series B',
          backgroundColor: ["#3DA7C8"],
          hoverBackgroundColor: ["#3DA7C8"],
          barThickness: 25,
          borderColor: ["#3DA7C8"],
          borderWidth: 1,
          borderRadius:15,
          hoverBorderColor: "#3DA7C8",
          hoverBorderWidth: 0,
          yAxisID: 'y-axis-r', 
         },
    ],
  };
  public monthbarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

}
