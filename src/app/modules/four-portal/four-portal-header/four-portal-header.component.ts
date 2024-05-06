import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { WebSocketService } from "src/app/shared/web-socket.service"
// import { IndiviualDoctorService } from "../indiviual-doctor.service"
import { HospitalService } from "../../hospital/hospital.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IndiviualDoctorService } from "../../individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../four-portal.service";

@Component({
  selector: 'app-four-portal-header',
  templateUrl: './four-portal-header.component.html',
  styleUrls: ['./four-portal-header.component.scss'],
  encapsulation: ViewEncapsulation.None,

})


export class FourPortalHeaderComponent implements OnInit {

  @ViewChild("info_popup") info_popup: ElementRef;
  userName: any = "";
  menuSelected = "";
  userProfile: any = "";
  @Input() user_Name: string;
  isLoggedIn: boolean = true
  notificationlist: any = [];
  notiCount: number = 0;
  isViewcount: number = 0;
  userRole: any;
  loginId: any;
  staff_Id: any;
  ncount: any = [];
  notify: any;
  notificationCount: any;
  route_type: string;
  userType: any;
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  currentLogsID: any;
  constructor(private auth: AuthService, private _coreService: CoreService, private modalService: NgbModal,private route: ActivatedRoute,

    private websocket: WebSocketService, private fouePortalService: FourPortalService, private service: HospitalService, private _webSocketService: WebSocketService,
    private router: Router) {
    this._coreService.SharingMenu.subscribe((res) => {
      if (res != "default") {
        this.menuSelected = res;
      } else {
        this.menuSelected = this._coreService.getLocalStorage("menuTitle");
      }
    });

    if (this._coreService.getLocalStorage("loginData")) {
      let role = this._coreService.getLocalStorage("loginData")?.role;
      let adminData = JSON.parse(localStorage.getItem("adminData"));
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      if (role === "INDIVIDUAL") {
        this.userName = adminData?.full_name;
        this.userProfile = adminData?.profile_picture?.url;
        this.userRole = loginData?.role
        this.userType = loginData?.type
        this.loginId = loginData._id
        this.getPortalDetails();
        // this.getnotificationdata(this.loginId);
      } else if (role === "HOSPITAL") {
        this.userName = adminData?.full_name;
        this.userProfile = adminData?.profile_picture?.url;
        this.userRole = loginData?.role
        this.userType = loginData?.type
        this.loginId = loginData._id
        this.getPortalDetails();
        // this.getnotificationdata(this.loginId);
      }
      else if (role === "STAFF") {
        // console.log("this.userName",this.userName);
        
        this.userName = adminData?.name;
        this.staff_Id = loginData._id
        this.userRole = loginData?.role
        this.userType = loginData?.type
        this.userProfile = adminData?.profile_picture?.url;
        this.getstaffdetails(this.staff_Id, this.userType)

        // this.getnotificationdata(this.staff_Id);
      }
    }
    else {
      let adminData = JSON.parse(sessionStorage.getItem("adminData"));
      let loginData = JSON.parse(sessionStorage.getItem("loginData"));
      let role = this._coreService.getSessionStorage("loginData")?.role;
      if (role === "INDIVIDUAL") {
        this.userName = adminData?.full_name;
        this.userProfile = adminData?.profile_picture?.url;
        this.userRole = loginData?.role
        this.userType = loginData?.type
        this.loginId = loginData._id
        this.getPortalDetails();
        // this.getnotificationdata(this.loginId);
      } else if (role === "HOSPITAL") {
        this.userName = adminData?.full_name;
        this.userProfile = adminData?.profile_picture?.url;
        this.userRole = loginData?.role
        this.userType = loginData?.type
        this.loginId = loginData._id
        this.getPortalDetails();
        // this.getnotificationdata(this.loginId);
      }
      else if (role === "STAFF") {
        // console.log("this.userName",this.userName);
        
        this.userName = adminData?.name;
        this.staff_Id = loginData._id
        this.userRole = loginData?.role
        this.userType = loginData?.type
        this.getstaffdetails(this.staff_Id,this.userType )
        // this.getnotificationdata(this.staff_Id);
      }
    }
    this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
    this.realTimeNotification();
  }


  realTimeNotification() {
    this._webSocketService.receivedNotificationInfo().subscribe((res: any) => {
      console.log( "received notification ts");
      this.getnotificationList();

    
    });
  }

  ngAfterViewInit(): void {
    if (this._coreService.getLocalStorage("loginData")) {
      let loginData = JSON.parse(localStorage.getItem("loginData"));

      if (loginData.isFirstTime === 0) {
        this.openVerticallyCentereddetale(this.info_popup);
      }

    }

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.route_type = params.get('path');     
    });

    this.getnotificationList();
  }
  logout() {
    this.auth.logout(`/portals/login/${this.userType}`);
    this.updateLogs();   
  }

  updateLogs(){
    let reqData ={
      currentLogID : this.currentLogsID,
    }
    this.fouePortalService.updateLogs(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status == true){

        console.log("userAddress___________",response);
      }else{
        this._coreService.showError("", response.message)
      }
     
    })
  }
  getPortalDetails() {
    let reqData ={
      portal_user_id:this.loginId,
      type:this.userType
    }
    this.fouePortalService.getProfileDetailsById(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // console.log("response====",response);
      
      if (response.status) {
        this.userProfile = response?.data?.result[0]?.profile_picture?.url;
      } else {
        this._coreService.showError("", response.message)
      }
    });
  }

  getstaffdetails(id: any, type:any) {
    let pararm = {
      staffId: id,
      type: type
    };

    this.fouePortalService.getStaffDetails(pararm).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          this.userProfile = result?.body?.in_profile?.profile_picture
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
      this.getnotificationList();
    })
  }

  getnotificationList() {
    if(JSON.parse(localStorage.getItem("loginData"))){
      
      let notifylist = {
        for_portal_user: JSON.parse(localStorage.getItem("loginData"))?._id,
        page: this.page,
        limit: this.pageSize,
      };
      
      this.fouePortalService.getAllNotificationService(notifylist).subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if(response.status)
       {
        this.notificationlist=response.body.list;
        this.notiCount = response.body.count;
        this.isViewcount = response.body.isViewcount;     
       }
      }
      );
    }
  }

  changeIsViewStatus(){
    // console.log('changeIsViewStatus');
    if(this.notiCount>0)
    {
    let data={
      new:false,
      receiverId:JSON.parse(localStorage.getItem("loginData"))._id
    }
    this.fouePortalService.updateNotificationStatus(data).subscribe({
      next:(res)=>{
        // console.log(res);
        let result = this._coreService.decryptContext(res);
        if(result.status){
          this.notiCount=0
          this._coreService.showSuccess(result.message,'');
        }else{
        }
      },
      error:(err)=>{

      }
    })
  }
  }

  markAllRead(){
    let params = {
      sender:  JSON.parse(localStorage.getItem("loginData"))?._id,
    };

    this.fouePortalService.markAllReadNotification(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.ncount = [];
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }

  markReadById(data:any){
    console.log("abcd==>>",data)
    let params = {
      _id:data?._id
    };
    // console.log("paramsparamsparams",params);
    this.fouePortalService.markReadNotificationById(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // this.router.navigate([`/portals/communication/${this.userType}`], {
      //   queryParams: {
      //     type: data.chatId
      //   }
      // })

      if (response.status) {
        if (data?.notitype == 'chat') {
           this.router.navigate([`/portals/communication/${this.userType}`], {
           queryParams: {
           type: data.chatId
          }
        })
        }else if(data?.notitype == "New Appointment" || data?.notitype == "Appointment" || data?.notitype == "Cancel Appointment" || data?.notitype == "Reshedule Appointment" || data?.notitype == "Appointment Approved" || data?.notitype == "Appointment Rejected" || data?.notitype == "Booked Appointment" ||  data.notitype == "Appointment Reminder"){
          this.router.navigate([`/portals/appointment/${this.userType}/appointment-details/`+ data?.appointmentId])
        } else if (data?.notitype == "Order Request" || data?.notitype == "order request" || data?.notitype == "Amount Send" || data?.notitype == "Insurance Verified" || data?.notitype == "Order Cancelled" || data?.notitype == "Order Confirmed") {
          console.log("runnnnnnnn11")
          this.router.navigate([`/portals/order-request/${this.userType}/new-order-details`], {
            queryParams: {
              orderId: data?.appointmentId
            }
          })
        } else {
          console.log("runnnnnnnn22")
          this.router.navigate([`/portals/notification/${this.userType}`])
        }
      }

      this.ncount = [];
      console.log("this.ncount",this.ncount)
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }

  routeToProfile(){    
    this.router.navigate([`portals/viewProfile/${this.userType}`])
  }
  openVerticallyCentereddetale(info_popup: any) {

    this.modalService.open(info_popup, {
      centered: false, // Centering is set to false
      size: "lg",
      windowClass: 'left-aligned-modal'
    });
  }
}


