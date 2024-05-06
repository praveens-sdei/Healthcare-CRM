import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { CoreService } from 'src/app/shared/core.service';
import { WebSocketService } from 'src/app/shared/web-socket.service';
import { SuperAdminService } from '../super-admin.service';
import { InsuranceService } from '../../insurance/insurance.service';
import { PharmacyService } from '../../pharmacy/pharmacy.service';

@Component({
  selector: 'app-super-admin-header',
  templateUrl: './super-admin-header.component.html',
  styleUrls: ['./super-admin-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminHeaderComponent implements OnInit, OnDestroy {
  menuSelected: any = '';
  username: string = "";
  menuSubscription: Subscription;
  profileSubcription: Subscription;
  loginLogo: any = '';
  ncount: any = [];
  notify: any;
  notificationCount: any;
  notificationListt: any;
  userID: string = "";
  notificationData: any;

  notificationlist: any = [];
  notiCount: number = 0;
  isViewcount: number = 0;
  notificationId: any;
  userRole: any;
  staffProfileUrl: any;
  user_adminData: any;
  currentLogsID: any;

  constructor(private auth: AuthService,
    private _coreService: CoreService,
    private _webSocketService: WebSocketService,
    private _superAdminService: SuperAdminService,
    private router: Router,
    private insuranceService : InsuranceService,
    private pharmacyService : PharmacyService
  ) {
    this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
    this.menuSubscription = this._coreService.SharingMenu.subscribe((res) => {
      console.log(res);
      if (res != 'default') {
        this.menuSelected = res;
      } else {
        this.menuSelected = this._coreService.getLocalStorage('menuTitle');
      }

    });
    // if(this._coreService.getLocalStorage('loginData')){
    //   this.username = this._coreService.getLocalStorage('loginData').fullName;
    //   this.userRole = this._coreService.getLocalStorage('loginData').role.replace(/_/g, ' ')
    //   console.log("userRoleuserRole",this.userRole);
    // }

    this.profileSubcription = this._coreService.SharingProfile.subscribe((res) => {
      console.log(res);
      if (res != 'default') {

        this.username = res;
        this.userRole = this._coreService.getLocalStorage('loginData').role.replace(/_/g, ' ')
      } else {
        this.username = this._coreService.getLocalStorage('loginData').fullName;
        this.userRole = this._coreService.getLocalStorage('loginData').role.replace(/_/g, ' ')

      }

    });

  

    const adminData = this._coreService.getLocalStorage('adminData');
    this.user_adminData = adminData?._id;
    this.loginLogo = (adminData?.association_group_icon?.url) ? adminData?.association_group_icon?.url : '';
    console.log("loginLogo______________",this.loginLogo);

    const userData = this._coreService.getLocalStorage('loginData');
    if(userData.role === 'superadmin'){
      this.userID = userData._id;
      this.realTimeNotification();
      this.getnotificationList();
    }else{
      this.userID = adminData?.for_staff;
      for(let data of adminData?.permissions){
        if(data?.parent_id == '63d7939772e516c629eccfee' && data?.status == true){
          this.realTimeNotification();
          this.getnotificationList();
        }
      }
    }
  // this.getnotificationList();
  }

  realTimeNotification() {
    this._webSocketService.receivedNotificationInfo().subscribe((res: any) => {
      console.log( "received notification ts");
      this.getnotificationList();

    
    });
  }
  ngOnInit(): void {
    // this.getnotificationList();
    this.getStaffDetails();
   
  }

  logout() {
    this.auth.logout('/super-admin/login');
    this.updateLogs();
  }
  updateLogs(){
    let reqData ={
      currentLogID : this.currentLogsID
    }
    this._superAdminService.updateLogs(reqData).subscribe((res) => {
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
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }

    if (this.profileSubcription) {
      this.profileSubcription.unsubscribe();
    }

    // this._coreService.SharingData.
  }


  getRealTimeNotification() {
    this._webSocketService.receiveNotification().subscribe((res: any) => {
      // console.log(res,"resssssssssssssssssssssssssssss")
      this.ncount.push(res)
      this.notify = this.ncount.length;
      // console.log("this.notify",this.notify)
      this.getnotificationList();
    })
  }

  getnotificationList() {
    let notifylist = {
      for_portal_user: this.userID
    };

    this._superAdminService.getAllNotificationService(notifylist).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // console.log("response================",response)
      if (response.status) {
        this.notificationlist = response.body.list;
        console.log("notificationlist-->",this.notificationlist)
        this.notiCount = response.body.count;
        this.isViewcount = response.body.isViewcount;
      }
    }
    );
  }

  changeIsViewStatus() {
    console.log('changeIsViewStatus');
    if (this.notiCount > 0) {
      let data = {
        new: false,
        receiverId: JSON.parse(localStorage.getItem("loginData"))._id
      }
      this._superAdminService.updateNotificationStatus(data).subscribe({
        next: (res) => {
          console.log(res);
          let result = this._coreService.decryptContext(res);
          if (result.status) {
            this.notiCount = 0
            this._coreService.showSuccess(result.message, '');
          } else {
            // this._coreService.showError(result.error,'');
          }
        },
        error: (err) => {

        }
      })
    }
  }

  markAllRead() {
    let params = {
      sender: this.userID,
    };

    this._superAdminService.markAllReadNotification(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.ncount = [];
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }

  markReadById(data: any) {
    console.log("abcd", data)
    let params = {
      _id: data._id
    };
    console.log("paramsparamsparams", params);
    this._superAdminService.markReadNotificationById(params).subscribe((res: any) => {
      console.log("===res===", res)
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(data?.notitype == 'chat'){
        console.log("run1111111")
        this.router.navigate(['/super-admin/communication'], {
          queryParams: {
            type: data.chatId,
          },
        })
      }else if(data?.notitype === "New Registration"){
        console.log("run2222222")
        if(data?.created_by_type === 'patient'){
          this.router.navigate([`/super-admin/patient/details/${data.appointmentId}`]) 
        }else if(data?.created_by_type === 'individual-doctor'){
          this.router.navigate([`/super-admin/individualdoctor/basicinfo/${data.appointmentId}`]) 
        }else if(data?.created_by_type === 'insurance'){
          this.insuranceStatus(data.appointmentId)
          // this.router.navigate([`/super-admin/insurance/details/${data.appointmentId}/0`]) 
        }else if(data?.created_by_type === 'hospital'){
          this.router.navigate([`/super-admin/hospital/details/${data.appointmentId}`]) 
        }else if(data?.created_by_type === 'pharmacy'){
          this.pharmacyStatus(data)
          // this.router.navigate([`/super-admin/individualpharmacy/details/${data.appointmentId}/0`]) 
        }else if(data?.created_by_type === 'Paramedical-Professions'){
          this.router.navigate([`/super-admin/individualparamedical-professions/basicinfo/${data.appointmentId}`]) 
        }else if(data?.created_by_type === 'Dental'){
          this.router.navigate([`/super-admin/individualdental/basicinfo/${data.appointmentId}`]) 
        }else if(data?.created_by_type === 'Laboratory-Imaging'){
          this.router.navigate([`/super-admin/individuallaboratory-imaging/basicinfo/${data.appointmentId}`]) 
        }else if(data?.created_by_type === 'Optical'){
          this.router.navigate([`/super-admin/individualoptical/basicinfo/${data.appointmentId}`]) 
        }
      }
     
      this.ncount = [];
      console.log("this.ncount", this.ncount)
      this.getRealTimeNotification();
      this.getnotificationList();
    })
  }


  getStaffDetails() {
    console.log("response===========", this.user_adminData)

    if (this.user_adminData === null || this.user_adminData === undefined) {
      return;
    }
    this._superAdminService.getStaffDetails(this.user_adminData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      // this.staffData = response?.data?.data[0];
      // this.relatedStaff = response.data[1]?.pharmacy_details;
      console.log("response===========", response)

      this.staffProfileUrl = response?.data?.documentURL;
    }
    )
  }

  insuranceStatus(id: any) {
    let reqData = {
      portal_id: id
    };
    this.insuranceService.companyNameById(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        let status;
        if (response?.body?.adminData?.verify_status == 'PENDING') {
          status = 0
          this.router.navigate([`/super-admin/insurance/details/${id}/${status}`])
        } else if (response?.body?.adminData?.verify_status == 'APPROVED') {
          status = 1
          this.router.navigate([`/super-admin/insurance/details/${id}/${status}`])
        } else if (response?.body?.adminData?.verify_status == 'DECLINED') {
          status = 2
          this.router.navigate([`/super-admin/insurance/details/${id}/${status}`])
        }
      }
    });
  }

  pharmacyStatus(data:any){
    this.pharmacyService.viewProfileById(data?.created_by).subscribe({
      next: (result:any) => {
        let response = this._coreService.decryptObjectData({ data: result });
        console.log("PROFILE DETAILS===>", response); 

        let status;
        if (response?.data?.adminData?.verify_status == 'PENDING') {
          status = 0
          this.router.navigate([`/super-admin/individualpharmacy/details/${data?.appointmentId}/${status}`])
        } else if (response?.data?.adminData?.verify_status == 'APPROVED') {
          status = 1
          this.router.navigate([`/super-admin/individualpharmacy/details/${data?.appointmentId}/${status}`])
        } else if (response?.data?.adminData?.verify_status == 'DECLINED') {
          status = 2
          this.router.navigate([`/super-admin/individualpharmacy/details/${data?.appointmentId}/${status}`])
        }
      },
      error: (err: ErrorEvent) => {
        this._coreService.showError("Error", err.message);
      },
    });
  }

  // getUserMenus(){
  //   const params = {
  //     module_name: 'superadmin',
  //     user_id: this.userID
  //   }
  //   this._superAdminService.getUserMenus(params).subscribe((res: any) => {
  //     const decryptedData = this._coreService.decryptObjectData(res)
  //     console.log("decryptedData===>",decryptedData)
  //     const menuArray = {}
  //     for (const data of decryptedData?.body) {
  //      if(data?.menu_id?._id == '63d7939772e516c629eccfee'){
  //       this.getRealTimeNotification();
  //      }
  //     }
    
  //   }
  // );
  // }
}
