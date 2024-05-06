import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { thisYear } from '@igniteui/material-icons-extended';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-hospital-dashboard',
  templateUrl: './hospital-dashboard.component.html',
  styleUrls: ['./hospital-dashboard.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class HospitalDashboardComponent implements OnInit {

  userID: any;
  allAppointmentCount:any = 0;
  dateFilter: any = '';
  yearFilter : any = new Date().getFullYear();
  totalStaffCount: any= 0;
  doctordata: any;
  fourportaldata: any;
  totalDoctorforHospitalCount: any=0;
  totalRevenue: any=0;
  totalSubmitedClaim: any=0;
  years: number[] = [];
  graphYear : any;
  medicalConsultation:any;
  hospitalization: any;
  preauth: any;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _coreService: CoreService,
    private _hospitalService: HospitalService,
    private loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.yeardropdown()
   }

  ngOnInit(): void {
    console.log('dashboard');
    this.getallcountList();
    this.getallstaffcountList();
  }
  
  
  getallcountList() {
    let reqData = {
      hospital_id: this.userID,
      dateFilter: this.dateFilter,
      yearFilter : this.yearFilter
    };


    this._hospitalService.getHospitalDashboardCount(reqData).subscribe(async(res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE==========>", response);
      this.doctordata = response?.data;
      this.fourportaldata= response?.data?.fourportalData;
      console.log("this.fourportaldata______",this.fourportaldata)
      this.allAppointmentCount = this.doctordata?.totaldoctorcount +  this.fourportaldata?.totalFourPortalCount;
      this.totalRevenue =  this.doctordata?.totalRevenue ? this.doctordata?.totalRevenue : 0;
      this.totalSubmitedClaim = this.doctordata?.totalSubmitedClaimCount ? this.doctordata?.totalSubmitedClaimCount : 0;

      const dentalAppointments = this.fourportaldata?.data.filter(item => item?.appointments?.portal_type === "Dental");
      const dentalCount = dentalAppointments?.length;

      const LaboratoryAppointments = this.fourportaldata?.data.filter(item => item?.appointments?.portal_type === "Laboratory-Imaging");
      const laboratoryCount = LaboratoryAppointments?.length;

      const opticalAppointments = this.fourportaldata?.data.filter(item => item?.appointments?.portal_type === "Optical");
      const opticalCount = opticalAppointments?.length;

      const paramedicalAppointments = this.fourportaldata?.data.filter(item => item?.appointments?.portal_type === "Paramedical-Professions");
      const paramedicalCount = paramedicalAppointments?.length;
      
      console.log("Number of appointments with portal_type:", dentalCount,laboratoryCount,opticalCount,paramedicalCount);
      
      this.barChartData = this.areAllValuesZeroOrUndefined([dentalCount,laboratoryCount,opticalCount,paramedicalCount])
      ? null
      : {
        labels: [ 'Doctor', 'Dental','Laboratory','Optical','Paramedical'],
        datasets: [
          {
            data: [this.doctordata?.totaldoctorcount,dentalCount,laboratoryCount,opticalCount,paramedicalCount],
            label: "Series A",
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 50,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius: 300,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: "y-axis-r",
          },
        ],
      };

      let medicalConsultationArray = await this.doctordata?.claimgraphdata?.data1;
      let hospitalizationArray = await this.doctordata?.claimgraphdata?.data2;
      let preauthArray = await this.doctordata?.claimgraphdata?.data3;

      this.medicalConsultation = Object.values(medicalConsultationArray);
      this.hospitalization = Object.values(hospitalizationArray);
      // this.preauth = Object.values(preauthArray);

      this.lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data:  this.medicalConsultation,
            fill: false,
            tension: 0.5,
            borderColor: '#00CFC3',
            pointBackgroundColor: '#fff',
            pointBorderColor: '#00CFC3',
            pointRadius: 8,
          },
          {
            data:  this.hospitalization,
            fill: false,
            tension: 0.5,
            borderColor: '#3DA7C8',
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3DA7C8',
            pointRadius: 8,
          },
          // {
          //   data:  this.preauth,
          //   fill: false,
          //   tension: 0.5,
          //   borderColor: '#0B4977',
          //   pointBackgroundColor: '#fff',
          //   pointBorderColor: '#0B4977',
          //   pointRadius: 8,
          // }
        ]
      };
    });
  }

  areAllValuesZeroOrUndefined(arr: number[]): boolean {
    return arr.every(value => value === 0 || value === undefined);
  }

  getallstaffcountList() {
    let reqData = {
      hospital_id: this.userID,
      dateFilter: this.dateFilter,
      yearFilter : this.yearFilter
    };

    this._hospitalService.getHospitalDashboardstaffCount(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log(response , "chart_________________");
      
      this.totalStaffCount = response?.data?.staffCount;
      this.totalDoctorforHospitalCount = response?.data?.doctorCount;
    });
  }
  
  getSelectedDate(event: any) {
    console.log(event.value, "selectedDatee___");
    this.dateFilter = event.value;
    this.yearFilter = ""
    this.getallcountList();
    this.getallstaffcountList();
  }
  getGraphYear (value : any) {
    this.yearFilter = value;
    this.dateFilter = ""
    this.getallcountList();
    this.getallstaffcountList();
    
  }

  yeardropdown() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }
    this.graphYear = currentYear;
  //  this.graphYear = currentYear
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

handledoctor(link : any){
  this.router.navigate([link]);
}
  
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // Bar chart
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Doctor', 'dental','laboratory','optical','paramedical'],
    datasets: [
      { data: [ 50,20,25 ],
         label: 'Series A',
         backgroundColor: ["#0B4977"],
         hoverBackgroundColor: ["#D9EFFF"],
         barThickness: 40,
         borderColor: ["#0B4977"],
         borderWidth: 1,
         borderRadius:50,
         hoverBorderColor: "#D9EFFF",
         hoverBorderWidth: 0,
         yAxisID: 'y-axis-r', 
        },
      
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

 
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
        data: [ 100, 50, 20, 150, 10, 120, 100,50, 0,150,56, 88, ],
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


}
