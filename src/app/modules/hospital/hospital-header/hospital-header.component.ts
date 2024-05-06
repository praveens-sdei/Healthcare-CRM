import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';
import { IEncryptedResponse } from 'src/app/shared/classes/api-response';
import { SuperAdminStaffResponse } from '../../super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type';
import { WebSocketService } from 'src/app/shared/web-socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hospital-header',
  templateUrl: './hospital-header.component.html',
  styleUrls: ['./hospital-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HospitalHeaderComponent implements OnInit {
  @ViewChild("info_popup") info_popup: ElementRef;

  profileSubcription: Subscription;
  username: string;
  profilePicture: any = ""
  userRole: any;
  staffName: any;
  menuSubscription: Subscription;
  menuSelected: any = '';
  admin_id: any;
  staff_id: any;
  profileImage: any;
  userDetails: any;
  staff_profile: any;

  ncount: any = [];
  notify: any;
  notificationCount: any;
  notificationListt: any;
  userID: string = "";
  notificationData: any;

  notificationlist:any=[];
  notiCount:number=0;
  isViewcount:number=0;
  notificationId: any;
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  currentLogsID: any;
    constructor(private modalService: NgbModal,private _webSocketService: WebSocketService,private auth: AuthService, private router: Router, private _coreService: CoreService, private _hospitalService: HospitalService,) {
    this.menuSubscription = this._coreService.SharingMenu.subscribe((res) => {
      if (res != 'default') {
        this.menuSelected = res;
      } else {
        this.menuSelected = this._coreService.getLocalStorage('menuTitle');
      }

    });   

    if (this._coreService.getLocalStorage('loginData').role === "HOSPITAL_ADMIN") {
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      this.userID = loginData._id;
      let adminData = JSON.parse(localStorage.getItem("adminData"));
      this.admin_id = loginData?._id;
      this.username = adminData?.hospital_name;
      this.userRole = loginData?.role.replace(/_ADMIN/g, ' Administrator')
      this.getProfile();

    } else if (this._coreService.getLocalStorage("loginData")?.role === "HOSPITAL_STAFF") {
      let adminData = JSON.parse(localStorage.getItem("adminData"));
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      this.userID = loginData._id;
      let staffData = JSON.parse(localStorage.getItem('staffData'))
      this.staff_id = loginData?._id
      this.username = staffData?.name;
      this.userRole = loginData?.role.replace(/_/g, ' ')
      this.getSpecificStaffDetails(this.staff_id)
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
    this.getnotificationList();
  }
  logout() {
    this.auth.logout('/hospital/login');
    this.updateLogs();
  }

  updateLogs(){
    let reqData ={
      currentLogID : this.currentLogsID
    }
    this._hospitalService.updateLogs(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status == true){

        console.log("response___________",response);
      }else{
        this._coreService.showError("", response.message)
      }
     
    })
  }



  getProfile() {
    this._hospitalService.viewProfile(this.admin_id).subscribe({
      next: (result: any) => {
        let response = this._coreService.decryptObjectData({ data: result });
        this.profileImage = response?.body?.userDetails?.profile_picture;
      },
      error: (err: ErrorEvent) => {
        this._coreService.showError("", err.message);
      },
    });
  }
  getSpecificStaffDetails(id: any) {

    const params = {
      hospitalStaffId: id,
    };
    this._hospitalService.getStaffDetails(params).subscribe({
      next: (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const staffDetails = this._coreService.decryptObjectData({
          data: result,
        });
        let alldetails = JSON.parse(JSON.stringify(staffDetails.body));
        this.profileImage = alldetails.in_profile.profile_picture;

      },
    });
  }
  ngOnDestroy(): void {
    if (this.profileSubcription) {
      this.profileSubcription.unsubscribe();
    }
  }

  getRealTimeNotification() {
    this._webSocketService.receiveNotification().subscribe((res: any) => {
      this.ncount.push(res)
      this.notify = this.ncount.length;
      this.getnotificationList();
    })
  }

  getnotificationList() {
    let notifylist = {
      for_portal_user: this.userID,
      page: this.page,
      limit: this.pageSize
    };
    
    this._hospitalService.getAllNotificationService(notifylist).subscribe((res) => {
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

  changeIsViewStatus(){
    console.log('changeIsViewStatus');
    if(this.notiCount>0)
    {
    let data={
      new:false,
      receiverId:JSON.parse(localStorage.getItem("loginData"))._id
    }
    this._hospitalService.updateNotificationStatus(data).subscribe({
      next:(res)=>{
        console.log(res);
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
      sender:  this.userID,
    };

    this._hospitalService.markAllReadNotification(params).subscribe((res: any) => {
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
    this._hospitalService.markReadNotificationById(params).subscribe((res: any) => {
      // console.log("===res===",res)
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status){
        if (data.notitype == "New Appointment" || data.notitype == "Appointment" || data.notitype == "Cancel Appointment" || data.notitype == "Reshedule Appointment") {
          this.router.navigate(['/hospital/appointment/appointmentdetails/' + data.appointmentId])
        }else if(data?.notitype == "chat"){
          this.router.navigate(['/hospital/communication'], {
            queryParams: {
              type: data.chatId,
            },
          })
        }
      }
      // this.router.navigate(['/hospital/communication'], {
      //   queryParams: {
      //     type: data.chatId,
      //   },
      // })
      this.ncount = [];
      console.log("this.ncount",this.ncount)
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }


  openVerticallyCentereddetale(info_popup: any) {

    this.modalService.open(info_popup, {
      centered: false, // Centering is set to false
      size: "lg",
      windowClass: 'left-aligned-modal'
    });
  }
}
