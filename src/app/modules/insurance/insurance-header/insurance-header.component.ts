import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../insurance.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { IInsuranceStaffResponse } from "../insurance-staffmanagement/addstaff/insurance-add-staff.type";
import { WebSocketService } from "src/app/shared/web-socket.service";

@Component({
  selector: "app-insurance-header",
  templateUrl: "./insurance-header.component.html",
  styleUrls: ["./insurance-header.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsuranceHeaderComponent implements OnInit, OnDestroy {
  profileSubcription: Subscription;
  username: string = "";
  profile: string = "";
  isLoggedIn: boolean = false;

  @Input() details: any;
  userRole: any;
  profile_pic: any;
  staff_id: any;
  admin_id: any;
  groupIcon: any;
  notificationlist: any = [];
  notiCount: number = 0;
  isViewcount: number = 0;
  ncount: any = [];
  notify: any;
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  currentLogsID: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private _coreService: CoreService,
    private _insuranceService: InsuranceService,
    private _webSocketService: WebSocketService
  ) {
    if (this._coreService.getSessionStorage("adminData")) {
      let adminData = JSON.parse(sessionStorage.getItem("adminData"));
      console.log("adminData----->",adminData);
      
      this.profile_pic = adminData?.profile_pic

      this.username = adminData?.company_name;
      this.userRole = adminData?.role.replace(/_/g, ' ')
      console.log(" this.isLoggedIn====", this.isLoggedIn);
      // this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
    } else {
      let role = this._coreService.getLocalStorage("adminData")?.role;
      if (role === "INSURANCE_ADMIN") {
        
        let loginData = JSON.parse(localStorage.getItem("loginData"));
        let adminData = JSON.parse(localStorage.getItem("adminData"));
      console.log("adminData----->",adminData);
      this.isLoggedIn=true;
      this.currentLogsID = this._coreService.getSessionStorage('currentLogId');

        this.admin_id = loginData?._id;
        this.username = adminData?.company_name;
        this.userRole = adminData?.role.replace(/_ADMIN/g, ' Administrator')
        console.log(" this.isLoggedIn====", this.isLoggedIn);
        this.getInsuranceDetails();

      } else if (this._coreService.getLocalStorage("loginData")?.role === "INSURANCE_STAFF") {
        let adminData = JSON.parse(localStorage.getItem("adminData"));
        let loginData = JSON.parse(localStorage.getItem("loginData"));
        this.isLoggedIn=true;
        this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
        this.staff_id = loginData?._id
        this.admin_id = loginData?._id;
        this.username = adminData?.staff_name;
        this.userRole = loginData?.role.replace(/_/g, ' ')
        this.getSpecifiStaffDetails();
     
      }

    }
   
    this.realTimeNotification();
  }

  ngOnInit(): void { 
    this.getnotificationList();
  
  }

  realTimeNotification() {
    this._webSocketService.receivedNotificationInfo().subscribe((res: any) => {
      console.log( "received notification ts");
      this.getnotificationList();
    
    });
  }

  logout() {
    this.auth.logout("/insurance/login");
    this.updateLogs();
  }
  updateLogs(){
    let reqData ={
      currentLogID : this.currentLogsID
    }
    this._insuranceService.updateLogs(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status == true){

        console.log("response___________",response);
      }else{
        this._coreService.showError("", response.message)
      }
     
    })
  }
  ngOnDestroy(): void {
    if (this.profileSubcription) {
      this.profileSubcription.unsubscribe();
    }
  }

  getSpecifiStaffDetails() {
    this._insuranceService.getStaffDetails(this.staff_id).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {


        const staffDetailsResult = this._coreService.decryptObjectData(result)

        const staffDetails = staffDetailsResult?.body?.staffData
        this.profile_pic = staffDetailsResult?.body?.documentURL;
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');
      },
    });
  }

  getInsuranceDetails() {
    let reqData = {
      id: this.admin_id,
    };

    this._insuranceService.getProfileDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.profile_pic = response?.body?.profile_pic_signed_url
      }

    });
  }

  getRealTimeNotification() {
    this._webSocketService.receiveNotification().subscribe((res: any) => {
      // this.ncount.push(res)
      // this.notify = this.ncount.length;
      this.getnotificationList();
    })
  }

  getnotificationList() {
    if(JSON.parse(localStorage.getItem("loginData"))){

      let notifylist = {
        for_portal_user: JSON.parse(localStorage.getItem("loginData"))?._id,
        page: this.page,
        limit: this.pageSize
      };
  
      this._insuranceService.getAllNotificationService(notifylist).subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.notificationlist = response.body.list;
          this.notiCount = response.body.count;
          this.isViewcount = response.body.isViewcount;
        }
      }
      );
    }
  }


  changeIsViewStatus() {
    if (this.notiCount > 0) {
      let data = {
        new: false,
        receiverId: JSON.parse(localStorage.getItem("loginData"))._id
      }
      this._insuranceService.updateNotificationStatus(data).subscribe({
        next: (res) => {
          console.log(res);
          let result = this._coreService.decryptContext(res);
          if (result.status) {
            this.notiCount = 0
            this._coreService.showSuccess(result.message, '');
          } else {
            this._coreService.showError(result.error, '');
          }
        },
        error: (err) => {

        }
      })
    }
  }


  getnotificationdata() {
    this._insuranceService.getnotificationdate({ for_portal_user: JSON.parse(localStorage.getItem("loginData"))._id }).subscribe((response) => {

      let responsedecrypt = this._coreService.decryptObjectData({ data: response })
      if (responsedecrypt.status) {
        this.notificationlist = responsedecrypt.body.list;
        this.notiCount = responsedecrypt.body.count;
        this.isViewcount = responsedecrypt.body.isViewcount;
      }
    })
  }

  markAllRead(){
    let params = {
      sender: this.admin_id 
    };

    this._insuranceService.markAllReadNotification(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.ncount = [];
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }

  markReadById(data:any){
    console.log("abcd",data)
    let params = {
      _id:data._id
    };
    console.log("paramsparamsparams",params);
    this._insuranceService.markReadNotificationById(params).subscribe((res: any) => {
      // console.log("===res===",res)
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response){
        if(data?.notitype === 'New Claim'){
           this.router.navigate(['insurance/medicines/details'],{
            queryParams: {
              claimId: data.claimId,
            },
           })
        }else if(data?.notitype === 'chat'){
          this.router.navigate(['/insurance/communication'], {
            queryParams: {
              type: data.chatId,
            },
          })
        }
      }
     
      this.ncount = [];
      console.log("this.ncount",this.ncount)
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }


  redirectTo(data: any) {
    console.log(data, 'redirectToredirectTo');

    if (data.notitype == "New Appointment" || data.notitype == "Appointment" || data.notitype == "Cancel Appointment" || data.notitype == "Reshedule Appointment") {
      this.router.navigate(['/individual-doctor/appointment/appointmentdetails/' + data.appointmentId])
    }
  }
}
