import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { WebSocketService } from "src/app/shared/web-socket.service"
import { IndiviualDoctorService } from "../indiviual-doctor.service"
import { HospitalService } from "../../hospital/hospital.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-individual-doctor-header",
  templateUrl: "./individual-doctor-header.component.html",
  styleUrls: ["./individual-doctor-header.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndividualDoctorHeaderComponent implements OnInit {

  @ViewChild("info_popup") info_popup: ElementRef;
  doctorName: any = "";
  menuSelected = "";
  doctorProfile: any = "";
  @Input() doctor_name: string;
  isLoggedIn: boolean = true
  notificationlist: any = [];
  notiCount: number = 0;
  isViewcount: number = 0;
  doctorRole: any;
  loginId: any;
  staff_Id: any;
  ncount: any = [];
  notify: any;
  notificationCount: any;
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  currentLogsID: any;
  constructor(private auth: AuthService, private _coreService: CoreService, private modalService: NgbModal,
    private websocket: WebSocketService, private doctorservice: IndiviualDoctorService, private service: HospitalService, private _webSocketService: WebSocketService,
    private router: Router) {
    this._coreService.SharingMenu.subscribe((res) => {
      if (res != "default") {
        this.menuSelected = res;
      } else {
        this.menuSelected = this._coreService.getLocalStorage("menuTitle");
      }
      this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
    });
  }

  ngAfterViewInit(): void {
    if (this._coreService.getLocalStorage("loginData")) {
      let loginData = JSON.parse(localStorage.getItem("loginData"));

      if (loginData.isFirstTime === 0) {
        console.log("0000000000");
        this.openVerticallyCentereddetale(this.info_popup);
      }

    }

  }



  ngOnInit(): void {


    if (this._coreService.getLocalStorage("loginData")) {
      let role = this._coreService.getLocalStorage("loginData")?.role;
      let adminData = JSON.parse(localStorage.getItem("adminData"));
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      console.log("loginData___________");

      if (role === "INDIVIDUAL_DOCTOR") {
        this.doctorName = adminData?.full_name;
        this.doctorProfile = adminData?.profile_picture?.url;
        this.doctorRole = loginData?.role.replace(/_/g, ' ') + ' Administrator'
        this.loginId = loginData._id
        this.getDoctorDetails();

      } else if (role === "HOSPITAL_DOCTOR") {
        this.doctorName = adminData?.full_name;
        this.doctorProfile = adminData?.profile_picture?.url;
        this.doctorRole = loginData?.role.replace(/_/g, ' ')
        this.loginId = loginData._id
        this.getDoctorDetails();
      }
      else if (role === "INDIVIDUAL_DOCTOR_STAFF" || role === "HOSPITAL_STAFF") {
        this.doctorName = adminData?.in_profile?.name;
        this.staff_Id = loginData._id
        this.getstaffdetails(this.staff_Id)
        this.doctorRole = loginData?.role.replace(/_/g, ' ');

      }
    }
    else {
      let adminData = JSON.parse(sessionStorage.getItem("adminData"));
      let loginData = JSON.parse(sessionStorage.getItem("loginData"));
      let role = this._coreService.getSessionStorage("loginData")?.role;
      if (role === "INDIVIDUAL_DOCTOR") {
        this.doctorName = adminData?.full_name;
        this.doctorProfile = adminData?.profile_picture?.url;
        this.doctorRole = loginData?.role.replace(/_/g, ' ') + ' Administrator';
        this.loginId = loginData._id
        this.getDoctorDetails();

      } else if (role === "HOSPITAL_DOCTOR") {
        this.doctorName = adminData?.full_name;
        this.doctorProfile = adminData?.profile_picture?.url;
        this.doctorRole = loginData?.role.replace(/_/g, ' ')
        this.loginId = loginData._id
        this.getDoctorDetails();
      }
      else if (role === "INDIVIDUAL_DOCTOR_STAFF" || role === "HOSPITAL_STAFF") {
        this.doctorName = adminData?.in_profile?.name;
        this.staff_Id = loginData._id
        this.getstaffdetails(this.staff_Id)
        this.doctorRole = loginData?.role.replace(/_/g, ' ');
      }
    }
    this.getnotificationdata();
    this.realTimeNotification();
  }
  realTimeNotification() {
    this._webSocketService.receivedNotificationInfo().subscribe((res: any) => {
      console.log("received notification ts");
      this.getnotificationdata();


    });
  }


  logout() {
    this.auth.logout("/individual-doctor/login");
    this.updateLogs();
  }

  updateLogs() {
    let reqData = {
      currentLogID: this.currentLogsID,
    }
    this.doctorservice.updateLogs(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status == true) {

        console.log("userAddress___________", response);
      } else {
        this._coreService.showError("", response.message)
      }

    })
  }
  redirectTo(data: any) {
    console.log(data, 'redirectToredirectTo');

    if (data?.notitype == "New Appointment" || data?.notitype == "Appointment" || data?.notitype == "Cancel Appointment" || data?.notitype == "Reshedule Appointment" || data?.notitype == "Appointment Reminder") {
      this.router.navigate(['/individual-doctor/appointment/appointmentdetails/' + data?.appointmentId])
    }
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getnotificationdata();
  }
  getnotificationdata() {
    if (JSON.parse(localStorage.getItem("loginData"))) {
      let reqData = {
        for_portal_user: JSON.parse(localStorage.getItem("loginData"))?._id,
        limit: this.pageSize,
        page: this.page,
      }
      this.doctorservice.getnotificationdate(reqData).subscribe((response) => {

        let responsedecrypt = this._coreService.decryptObjectData({ data: response })
        if (responsedecrypt.status) {
          this.notificationlist = responsedecrypt.body.list;
          this.notiCount = responsedecrypt.body.count;
          this.isViewcount = responsedecrypt.body.isViewcount;
        }
      })
    }
  }
  getDoctorDetails() {
    this.service.getDoctorBasicInfo(this.loginId).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.doctorProfile = response?.data?.result[0]?.profile_picture?.url;
        console.log(this.doctorProfile, "doctorProfileee______", response.data.result[0]);

      } else {
        this._coreService.showError("", response.message)
      }
    });
  }

  getstaffdetails(id: any) {
    let pararm = {
      hospitalStaffId: id,
    };

    this.doctorservice.getStaffDetails(pararm).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          this.doctorProfile = result?.body?.in_profile?.profile_picture
        }

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRealTimeNotification() {
    this._webSocketService.receiveNotification().subscribe((res: any) => {
      this.ncount.push(res)
      this.notify = this.ncount.length;
      // this.getnotificationList();
      this.getnotificationdata();
    })
  }

  // getnotificationList() {
  //   let notifylist = {
  //     for_portal_user: JSON.parse(localStorage.getItem("loginData"))?._id
  //   };

  //   this.doctorservice.getAllNotificationService(notifylist).subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     console.log("response==>>>>>>>>>",response)
  //     if(response.status)
  //    {
  //     this.notificationlist=response.body.list;
  //     this.notiCount = response.body.count;
  //     this.isViewcount = response.body.isViewcount;     
  //    }
  //   }
  //   );
  // }

  changeIsViewStatus() {
    console.log('changeIsViewStatus');
    if (this.notiCount > 0) {
      let data = {
        new: false,
        receiverId: JSON.parse(localStorage.getItem("loginData"))._id
      }
      this.doctorservice.updateNotificationStatus(data).subscribe({
        next: (res) => {
          console.log(res);
          let result = this._coreService.decryptContext(res);
          if (result.status) {
            this.notiCount = 0
            this._coreService.showSuccess(result.message, '');
          } else {
          }
        },
        error: (err) => {

        }
      })
    }
  }

  markAllRead() {
    let params = {
      sender: JSON.parse(localStorage.getItem("loginData"))?._id,
    };

    this.doctorservice.markAllReadNotification(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.ncount = [];
      this.getRealTimeNotification();
      this.getnotificationdata();
      // this.getnotificationList();
    })
  }

  markReadById(data: any) {
    console.log("abcd", data)
    let params = {
      _id: data._id
    };
    console.log("paramsparamsparams", params);
    this.doctorservice.markReadNotificationById(params).subscribe((res: any) => {
      // console.log("===res===",res)
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        if (data.notitype == "New Appointment" || data.notitype == "Appointment" || data.notitype == "Cancel Appointment" || data.notitype == "Reshedule Appointment" || data.notitype == "Appointment Approved" || data.notitype == "Booked Appointment" || data.notitype == "Appointment Reminder") {
          this.router.navigate(['/individual-doctor/appointment/appointmentdetails/' + data.appointmentId])
        } else if (data.notitype == "chat") {
          this.router.navigate(['/individual-doctor/communication'], {
            queryParams: {
              type: data.chatId,
            }
          })
        } else {
          this.router.navigate(['/individual-doctor/notification'])
        }
      }

      this.ncount = [];
      console.log("this.ncount", this.ncount)
      this.getRealTimeNotification();
      this.getnotificationdata();
      // this.getnotificationList();
    })
  }


  openVerticallyCentereddetale(info_popup: any) {

    this.modalService.open(info_popup, {
      centered: false, // Centering is set to false
      size: "lg",
      windowClass: 'left-aligned-modal'
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

}


