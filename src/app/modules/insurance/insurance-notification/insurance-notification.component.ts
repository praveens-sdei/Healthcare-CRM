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
  selector: 'app-insurance-notification',
  templateUrl: './insurance-notification.component.html',
  styleUrls: ['./insurance-notification.component.scss']
})
export class InsuranceNotificationComponent implements OnInit {

  userRole: any;
  notificationlist: any = [];
  notiCount: number = 0;
  isViewcount: number = 0;
  ncount: any = [];
  notify: any;
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  constructor(
    private auth: AuthService,
    private router: Router,
    private _coreService: CoreService,
    private _insuranceService: InsuranceService,
    private _webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.getnotificationList();
  }

  getnotificationList() {
    let notifylist = {
      for_portal_user: JSON.parse(localStorage.getItem("loginData"))?._id,
      page: this.page,
      limit: this.pageSize
    };

    this._insuranceService.getAllNotificationService(notifylist).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response>>>>>>>>>>",response)
      if (response?.status) {
        this.notificationlist = response?.body?.list;
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
        }else{
          this.router.navigate(['/insurance/communication'], {
            queryParams: {
              type: data.chatId,
            },
          })
        }
      }
     
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
