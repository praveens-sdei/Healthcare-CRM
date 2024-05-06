import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ChartConfiguration, ChartOptions } from "chart.js";
import { IndiviualDoctorService } from "../indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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

@Component({
  selector: "app-individual-doctor-dashboard",
  templateUrl: "./individual-doctor-dashboard.component.html",
  styleUrls: ["./individual-doctor-dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndividualDoctorDashboardComponent implements OnInit {
  displayedColumns: string[] = [
    "patientname",
    "dateandtime",
    "consultationtype",
    "action",
  ];
  dataSource = ELEMENT_DATA;

  userID: any = "";
  doctor_portal_id: any;
  userRole: any = "";
  for_portal_user: any = "";

  allAppointmentList: any[] = [];
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  selectedStatus: any = "ALL";
  consultationType: any = "ALL";
  dateFilter: any = "";
  doctor_id: any = "";

  todaysTotalLength: number = 0;
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
  innerMenuPremission:any=[];

  submitted: any = 0;
  approved: any = 0;
  requested: any = 0;
  rejected: any = 0;

  totalTestsCount: any = 0
  onlineAppCount: any = 0;
  homeVisitAppCount: any = 0;
  f2fAppCount: any = 0;

  totalf2fRevenue: any = 0;
  totalOnlineRevenue: any = 0;
  totalHomeVisitRevenue: any = 0;
  totalRevenue: any = 0;
  constructor(
    private _coreService: CoreService,
    private service: IndiviualDoctorService,
    private route: Router,
    private modalService: NgbModal
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    // this.checkForPlan();
  }

  ngOnInit(): void {

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;
    // this.assign_doctor_depart = adminData?.department;
    // this.assign_doctor_services = adminData?.services;
    // this.assign_doctor_unit = adminData?.department;
    // this.assign_Doctor = adminData?.for_doctor;


    if (
      this.userRole === "INDIVIDUAL_DOCTOR" ||
      this.userRole === "HOSPITAL_DOCTOR"
    ) {
      this.doctor_id = loginData?._id;
    } else {
      this.doctor_id = adminData?.in_hospital;
    }

    this.for_portal_user = adminData?.in_hospital;
    this.testsCountOfAllApptypes();
    // this.getOnlineConsulationCount();
    // this.getFacetoFaceConsulationCount();
    // this.getHomeConsulationCount()
    this.getAppointmentlist();
    this.getPatientCount();
    // this.getAllConsulationFee();

    this.getGraphlist();
    this.getTotalClaimsOfTest();

    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }
  
  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }
  checkInnerPermission(){

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

console.log(userPermission,"zsdfsfsdfsdf",menuID);

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("medical_consultation")) {
          this.innerMenuPremission = checkSubmenu['medical_consultation'].inner_menu;

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
        console.log("this.innerMenuPremission_______________-",this.innerMenuPremission);
        
      }      
    }  
    

  }
  giveInnerPermission(value){
    if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF" || this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }  
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
  // public lineChartData: ChartConfiguration<"line">["data"] = {
  //   labels: [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Aug",
  //     "Sep",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ],
  //   datasets: [
  //     {
  //       data: [50, 100, 150, 200, 300, 200, 100, 70, 100, 200, 300, 330, 250],
  //       label: "Series A",
  //       tension: 0.5,
  //       borderColor: "#1BDCAE",
  //       backgroundColor: "white",
  //     },
  //   ],
  // };
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
  
  getSelectedDate(event: any) {
    console.log(event.value, "selectedDatee___");
    this.dateFilter = event.value;
    this.testsCountOfAllApptypes();
    this.getPatientCount();
  }

  // allapointmentlist
  getAppointmentlist() {
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    console.log("ROLE====>", adminData);
    this.doctor_portal_id = [];

    if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
      this.doctor_portal_id.push(this.for_portal_user);
    }
    else if (this.userRole === "HOSPITAL_STAFF") {
      adminData?.for_doctor.forEach((doctorid) => {
        console.log("doctor_portal_id", doctorid)
        if (this.doctor_portal_id.indexOf(doctorid) == -1) {
          this.doctor_portal_id.push(doctorid);
          console.log("doctor_portal_id", doctorid)
        }
      })
      // await this.getDoctor();
    }
    else {
      this.doctor_portal_id.push(this.doctor_id);
    }

    let reqData = {
      doctor_portal_id: this.doctor_portal_id,
      limit: this.pageSize,
      page: this.page,
      // status: this.selectedStatus,
      status: "TODAY",
      consultation_type: this.consultationType,
      date: this.dateFilter,
    };

    console.log("REQ DATAAAAAAAAAAA==>", reqData);
    this.service.appoinmentListApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // console.log("appoinmentListApi 1");
      console.log("APPOINTMENT LISTTTTTTTTT===>", response);
      this.dataSource = response?.data?.data;
      this.allAppointmentList = response?.data?.data;
      this.totalLength = response?.data?.totalCount;
      this.todaysTotalLength = response?.data?.totalCount;
      console.log("todaysTotalLength===>", this.todaysTotalLength);
    });
  }

  getPatientCount() {
    let reqData = {
      doctorId: this.doctor_id,
      searchText: this.searchText,
      page: this.page,
      limit: this.pageSize
    };

    this.service.getPatientListAddedByDoctor(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // this.dataSource = response?.body?.allPatient;
      this.totalPatientLength = response?.body?.count ? response?.body?.count : 0;

      // console.log("PATIENT LIST===>", response);
    });
  }

  getGraphlist() {
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    console.log("ROLE====>", adminData);
    this.doctor_portal_id = [];

    if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
      console.log("run1")
      this.doctor_portal_id.push(this.for_portal_user);
    }
    else if (this.userRole === "HOSPITAL_STAFF") {
      console.log("run2")
      adminData?.for_doctor.forEach((doctorid) => {
        console.log("doctor_portal_id", doctorid)
        if (this.doctor_portal_id.indexOf(doctorid) == -1) {
          this.doctor_portal_id.push(doctorid);
          console.log("doctor_portal_id", doctorid)
        }
      })
      // await this.getDoctor();
    }
    else {
      console.log("run3")
      this.doctor_portal_id.push(this.doctor_id);
    }

    let reqData = {
      doctor_portal_id: this.doctor_portal_id,
      status: this.selectedStatus,
      consultation_type: this.consultationType,
      date: this.dateFilter,
    };
    this.service.approvedStatusApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // console.log("appoinmentListApi 1");
      console.log("APPOINTMENT LISTTTTTTTTT===>", response);
     
      this.totalLength = response?.data?.totalCount;
      console.log("totalLength===>", this.totalLength);

      // Graph Content
      let graph = response?.data?.graphData;
      this.totalCountForGraph = Object.values(graph);
      // Update lineChartData with the new data
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
            data: this.totalCountForGraph,
            label: "Series A",
            tension: 0.5,
            borderColor: "#1BDCAE",
            backgroundColor: "white",
          },
        ],
      };
    });
  }

  getTotalClaimsOfTest() {
    let reqData = {
      doctor_portal_id: this.doctor_id
    }
    this.service.getTestsTotalClaimsForGraph(reqData).subscribe(async (res: any) => {
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

  areAllValuesZeroOrUndefined(arr: number[]): boolean {
    return arr.every(value => value === 0 || value === undefined);
  }

  handleSelectFliterList(event: any) {
    this.selectedStatus = event.value;
    console.log("this.selectedStatus", this.selectedStatus)
    this.getGraphlist();
  }

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

  testsCountOfAllApptypes() {
    let data = {
      doctor_portal_id: this.doctor_id,
      dateFilter: this.dateFilter
    }
    this.service.getTotalTests(data).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response_______",response)

      this.totalTestsCount = response?.data?.totalTestsCountInfo?.length;
      this.onlineAppCount = response?.data?.onlineAppointments?response?.data?.onlineAppointments:this.onlineAppCount;
      this.homeVisitAppCount = response?.data?.homeVisitAppointments?response?.data?.homeVisitAppointments:this.homeVisitAppCount;
      this.f2fAppCount = response?.data?.f2fAppointments?response?.data?.f2fAppointments:this.f2fAppCount;

      this.totalf2fRevenue = response?.data?.appointmentsRevenue?.totalF2FRevenue?response?.data?.appointmentsRevenue?.totalF2FRevenue:this.totalf2fRevenue;
      this.totalOnlineRevenue = response?.data?.appointmentsRevenue?.totalOnlineRevenue?response?.data?.appointmentsRevenue?.totalOnlineRevenue:this.totalOnlineRevenue;
      this.totalHomeVisitRevenue = response?.data?.appointmentsRevenue?.totalHomeVisitRevenue?response?.data?.appointmentsRevenue?.totalHomeVisitRevenue:this.totalHomeVisitRevenue;

      this.totalRevenue = this.totalf2fRevenue + this.totalOnlineRevenue + this.totalHomeVisitRevenue;

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
    }
    )
  }
}
