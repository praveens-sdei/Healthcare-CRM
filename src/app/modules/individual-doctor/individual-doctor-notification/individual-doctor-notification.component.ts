import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { WebSocketService } from "src/app/shared/web-socket.service"
import { IndiviualDoctorService } from "../indiviual-doctor.service"
import { HospitalService } from "../../hospital/hospital.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-individual-doctor-notification',
  templateUrl: './individual-doctor-notification.component.html',
  styleUrls: ['./individual-doctor-notification.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class IndividualDoctorNotificationComponent implements OnInit {

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
  userID:any;
  userRole: any;
  constructor(private auth: AuthService, private _coreService: CoreService, private modalService: NgbModal,
     private websocket: WebSocketService, private doctorservice: IndiviualDoctorService, private service: HospitalService,private _webSocketService: WebSocketService,
    private router: Router) { 
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      let adminData = JSON.parse(localStorage.getItem("adminData"));
  
      this.userRole = loginData?.role;
  
      if(this.userRole === "HOSPITAL_STAFF"){
        this.userID = adminData?.for_doctor;
  
      }else if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF"){
        this.userID = adminData?.in_hospital;
      }else{
        this.userID = loginData?._id;
  
      }
    }

  ngOnInit(): void {
    this.getnotificationdata();
  }

    getnotificationdata() {
    let reqData={
      for_portal_user:this.userID,
      limit: this.pageSize,
      page: this.page,
    }
    this.doctorservice.getnotificationdate(reqData).subscribe((response) => {

      let responsedecrypt = this._coreService.decryptObjectData({ data: response })
      if (responsedecrypt.status) {
        this.notificationlist = responsedecrypt.body.list;
        this.notiCount = responsedecrypt.body.count;
        this.isViewcount = responsedecrypt.body.isViewcount;
        this.totalLength = responsedecrypt?.body.totalCount;
      }
    })
  }

  markReadById(data:any){
    console.log("abcd",data)
    let params = {
      _id:data._id
    };
    console.log("paramsparamsparams",params);
    this.doctorservice.markReadNotificationById(params).subscribe((res: any) => {
      // console.log("===res===",res)
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status){
        if (data.notitype == "New Appointment" || data.notitype == "Appointment" || data.notitype == "Cancel Appointment" || data.notitype == "Reshedule Appointment" || data.notitype == "Appointment Approved" || data?.notitype == "Booked Appointment") {
          this.router.navigate(['/individual-doctor/appointment/appointmentdetails/' + data.appointmentId])
        }else if (data.notitype == "chat") {
          this.router.navigate(['/individual-doctor/communication'], {
            queryParams: {
              type: data.chatId,
            }
          })
        }else{
          this.router.navigate(['/individual-doctor/notification'])
        }
      }
      
      this.ncount = [];
      console.log("this.ncount",this.ncount)
      this.getnotificationdata();
      // this.getnotificationList();
    })
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getnotificationdata();
  }
}
