import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';
import { IEncryptedResponse } from 'src/app/shared/classes/api-response';
import { SuperAdminStaffResponse } from '../../super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type';
import { WebSocketService } from 'src/app/shared/web-socket.service';

@Component({
  selector: 'app-hospital-notification',
  templateUrl: './hospital-notification.component.html',
  styleUrls: ['./hospital-notification.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class HospitalNotificationComponent implements OnInit {

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
    constructor(private _webSocketService: WebSocketService,private auth: AuthService, private router: Router, private _coreService: CoreService, private _hospitalService: HospitalService,){
      
    let loginData = JSON.parse(localStorage.getItem("loginData")); 

    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.userID = admindata?.in_hospital;

    }else{
      this.userID = loginData?._id;
    }
    }
  ngOnInit(): void {
    this.getnotificationList();
  }

  getnotificationList() {
    let notifylist = {
      for_portal_user: this.userID,
      page: this.page,
      limit: this.pageSize,
    };
    
    this._hospitalService.getAllNotificationService(notifylist).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status)
     {
      this.notificationlist=response?.body?.list;
      this.notiCount = response?.body?.count;
      this.isViewcount = response?.body?.isViewcount;  
      this.totalLength = response?.body?.totalCount;   
     }
    }
    );
  }

  markReadById(data:any){
    console.log("abcd",data)
    let params = {
      _id:data._id
    };
    this._hospitalService.markReadNotificationById(params).subscribe((res: any) => {
      // console.log("===res===",res)
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status){
        if (data.notitype == "New Appointment" || data.notitype == "Appointment" || data.notitype == "Cancel Appointment" || data.notitype == "Reshedule Appointment" || data.notitype == "Booked Appointment") {
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
      this.getnotificationList();
    })
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getnotificationList();
  }
}
