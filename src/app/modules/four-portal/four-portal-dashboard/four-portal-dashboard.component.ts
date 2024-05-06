import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ChartConfiguration, ChartOptions } from "chart.js";
import { CoreService } from "src/app/shared/core.service";
import { Router } from "@angular/router";

export interface PeriodicElement {
  patientname: string;
  dateandtime: string;
  consultationtype: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    patientname: "Guy Hawkins",
    dateandtime: "08-21-2022 | 03:50Pm",
    consultationtype: "Consultation Type",
  },
  {
    patientname: "Guy Hawkins",
    dateandtime: "08-21-2022 | 03:50Pm",
    consultationtype: "Consultation Type",
  },
  {
    patientname: "Guy Hawkins",
    dateandtime: "08-21-2022 | 03:50Pm",
    consultationtype: "Consultation Type",
  },
];
import { ActivatedRoute } from '@angular/router';
import { IndiviualDoctorService } from "../../individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../four-portal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-four-portal-dashboard',
  templateUrl: './four-portal-dashboard.component.html',
  styleUrls: ['./four-portal-dashboard.component.scss']
})
export class FourPortalDashboardComponent implements OnInit {
  displayedColumns: string[] = [
    "patientname",
    "dateandtime",
    "consultationtype",
    "action",
  ];
  dataSource: any = [];

  userID: any = "";
  doctor_portal_id: any;
  userRole: any = "";
  for_portal_user: any = "";

  allAppointmentList: any[] = [];
  page: any = 1;
  pageSize: number = 3;
  totalLength: number = 0;
  searchText: any = "";
  selectedStatus: any = "ALL";
  consultationType: any = "ALL";
  doctor_id: any = "";


  pieChartLabels: string[] = ['Online', 'Face-to-Face', 'Home Visit'];

  route_type: any = '';
  login_portal_id: any = '';

  totalTestsCount: any = 0
  onlineAppCount: any = 0;
  homeVisitAppCount: any = 0;
  f2fAppCount: any = 0;

  totalf2fRevenue: any = 0;
  totalOnlineRevenue: any = 0;
  totalHomeVisitRevenue: any = 0;
  totalRevenue: any = 0;

  totalTestsForLine: any = [];
  appntStatus: any = 'ALL';

  submitted: any = 0;
  approved: any = 0;
  requested: any = 0;
  rejected: any = 0;

  dateFilter: any = '';
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private _coreService: CoreService,
    private service: IndiviualDoctorService,
    private route: Router,
    private act_route: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private modalService: NgbModal
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.loginrole = userData?.role;
    // this.checkForPlan();
  }

  ngOnInit(): void {

    this.act_route.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });
    console.log("this.route_type----", this.route_type);

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userRole = loginData?.role;
    this.login_portal_id = loginData?._id;


    this.testsCountOfAllApptypes();
    this.todaysAppointments();
    this.totalTestsForLineChart();
    this.getTotalClaimsOfTest();

    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
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
      }
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF' || this.loginrole === 'HOSPITAL_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }


  testsCountOfAllApptypes() {
    let data = {
      portalType: this.route_type,
      four_portal_id: this.login_portal_id,
      dateFilter: this.dateFilter
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
      console.log(response, "responseee__e", response?.data?.appointmentsRevenue);

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

  todaysAppointments(sort: any = '') {
    let reqData = {
      portal_id: this.login_portal_id,
      limit: this.pageSize,
      page: this.page,
      status: "TODAY",
      consultation_type: this.consultationType,
      date: this.dateFilter,
      sort: sort,
      portal_type: this.route_type
    };

    this.fourPortalService.fourPortal_appointment_list(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      let result = response?.data?.data;

      if (result.length > 0) {
        this.dataSource = response?.data?.data;
      } else {
        this.dataSource = [];
      }
      console.log(this.dataSource, "respon_tests__APP");
    })
  }

  totalTestsForLineChart() {
    let reqData = {
      portalType: this.route_type,
      four_portal_id: this.login_portal_id,
      appntStatus: this.appntStatus,
      dateFilter: this.dateFilter
    }
    console.log(reqData,"redDataaa_____");
    
    this.fourPortalService.getTotalTestsForLineChart(reqData).subscribe((res: any) => {
      console.log(res,"line_response__");
      
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response, "line_responsess___");

      let graph = response?.data?.monthlyTotalTests;
      if (graph) {
        this.totalTestsForLine = Object.values(graph);
      } else {
        this.totalTestsForLine = [];
      }

      this.lineChartData = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            data: this.totalTestsForLine,
            label: "Series A",
            tension: 0.5,
            borderColor: "#1BDCAE",
            backgroundColor: "white",
          },
        ],
      };
    })
  }

  handleSelectFliterList(event: any) {
    this.appntStatus = event.value;
    console.log("appntStatus_Selected__", this.selectedStatus)
    this.totalTestsForLineChart();
  }

  getTotalClaimsOfTest() {
    let reqData = {
      portalType: this.route_type,
      four_portal_id: this.login_portal_id,
    }
    this.fourPortalService.getTestsTotalClaimsForGraph(reqData).subscribe(async (res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response, "responseClaims___");
      //response.reSubmited, response.approved, response.rejected ,response.pending

      this.submitted = response?.data?.reSubmited;
      this.approved = response?.data?.approved;
      this.requested = response?.data?.pending;
      this.rejected = response?.data?.rejected;

      this.totalclaimChartData = this.areAllValuesZeroOrUndefined([this.submitted, this.approved, this.rejected, this.requested])
      ? null
      : {
          labels: ["Submitted", "Approved", "Rejected", "Requested"],
          datasets: [
            {
              data: [this.submitted, this.approved, this.rejected, this.requested],
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
    })
  }

  getSelectedDate(event: any) {
    console.log(event.value, "selectedDatee___");
    this.dateFilter = event.value;
    this.testsCountOfAllApptypes();
    this.totalTestsForLineChart();
  }

  async checkForPlan() {
    let isPurchased = await this.service.isPlanPurchesdByDoctor(this.userID); //check fot purchased plan

    console.log("POLICY==>", isPurchased);

    if (!isPurchased) {
      // this.modalService.open(this.confirmationModel);
      this._coreService.showError(
        "No plan purchsed! Please purches new plan",
        ""
      );
      this.route.navigate(["/individual-doctor/subscriptionplan"]);
      return;
    }
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // pie chart
  public pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
  };

  //public pieChartDatasets: any;
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

  //  Line chart
  public lineChartData: ChartConfiguration<"line">["data"];

  public lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
  };
  public lineChartLegend = false;

  //Total Claim chart
  public totalclaimChartLegend = false;
  public totalclaimChartPlugins = [];
  public totalclaimChartData: ChartConfiguration<"bar">["data"] = {
    labels: ["Submitted", "Approved", "Rejected ", "Requested"],
    datasets: [
      {
        data: [570, 260, 350, 210],
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
  public totalclaimChartOptions: ChartConfiguration<"bar">["options"] = {
    responsive: true,
  };

  closePopup() {
    this.modalService.dismissAll("close");
  }

  openVerticallyCenteredpiechartpopup(claimlistpopup: any) {
    this.modalService.open(claimlistpopup, {
      centered: true,
      size: "md",
      windowClass: "edit_staffnew",
    });
  }

  openVerticallyCenteredlinechartpopup(linechartpopup: any) {
    this.modalService.open(linechartpopup, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
    });
  }
}
