import { Component, OnInit,ViewEncapsulation, ViewChild,ElementRef  } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { SuperAdminService } from '../super-admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface PeriodicElement {
  notificationname: string;
  type: string;
  conditions: string;
  notificationapplies: string;
  content:string;
  time: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-super-admin-notificationmanagement',
  templateUrl: './super-admin-notificationmanagement.component.html',
  styleUrls: ['./super-admin-notificationmanagement.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class SuperAdminNotificationmanagementComponent implements OnInit {
  notificationDetails!: FormGroup;
  isSubmitted: any = false;
  pageSize: number = 20;
  totalLength: number = 0;
  page: any = 1;
  searchText = "";

  sortColumn: string = 'notification_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  // Define the options for the "Notification Applies" dropdown
  notificationAppliesOptions: { value: string; label: string }[] = [
    { value: '1', label: 'Pharmacy' },
    { value: '2', label: 'Patient' },
  ];
  displayedColumns: string[] = ['createdAt','notificationname', 'type', 'notificationapplies','content','action'];
  // dataSource= new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = ELEMENT_DATA;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userID: any;
  notification_id: any;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }


  constructor(private fb: FormBuilder,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private _superAdminService: SuperAdminService,
    private loader: NgxUiLoaderService) {

    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.notificationDetails = this.fb.group({
      notification_name: ["", [Validators.required]],
      notification_type: ["", [Validators.required]],
      // time: [""],
      notification_applies: [""],
      content: ["", [Validators.required]]
    });
  }

    //  Add healthcare network modal
    openVerticallyCenteredAddhealthnetwork(createnotificationcontent: any) {
      this.modalService.open(createnotificationcontent, { centered: true,size: 'md' });
    }

    openVerticallyEdit(createnotificationcontent: any, id: any) {
      this.notification_id = id;
      this.modalService.open(createnotificationcontent, { centered: true,size: 'md' });
      this.getNotificationById();
    }

    openVerticallyCenteredsecond(deleteNotification: any, id: any) {
      this.notification_id = id;
      this.modalService.open(deleteNotification, { centered: true, size: "sm" });
    }

    onSortData(column:any) {
      this.sortColumn = column;
      this.sortOrder = this.sortOrder === 1? -1 : 1;
      this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
      this.getAllNotificationlist(`${column}:${this.sortOrder}`);
    }
  

  ngOnInit(): void {
    this.notificationDetails.get('notification_type').valueChanges.subscribe((value) => {
      if (value === 'push') {
        this.notificationAppliesOptions = [
          // { value: 'all_push', label: 'All' },
          { value: 'Pharmacy Push', label: 'Pharmacy' },
          { value: 'Patient Push', label: 'Patient' },
        ];
      } else if (value === 'in_app') {
        this.notificationAppliesOptions = [
          // { value: 'all_app', label: 'All' },
          { value: 'Pharmacy App', label: 'Pharmacy' },
          { value: 'Patient App', label: 'Patient' },
          { value: 'Doctor App', label: 'Doctor' },
          { value: 'Hospital App', label: 'Hospital' },
          { value: 'Insurance App', label: 'Insurance' },
          { value: 'Dental', label: 'Dental' },
          { value: 'Optical', label: 'Optical' },
          { value: 'Paramedical-Professions', label: 'Paramedical-Professions' },
          { value: 'Laboratory-Imaging', label: 'Laboratory-Imaging' }
        ];
      }
    });
    this.getAllNotificationlist(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
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
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  getAllNotificationlist(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      sort:sort
    };
    this._superAdminService.getNotificationlist(reqData).subscribe((res) => {
        const decryptedData = this._coreService.decryptObjectData({data:res});
        // console.log("decryptedData.data===>>>",decryptedData)
        const data = [];
        for (const staff of decryptedData?.body?.data) {
          data.push({
            notificationname: staff?.notification_name,
            type: staff?.notification_type ,
            // conditions: staff?.notification_name,
            notificationapplies: staff?.notification_applies,
            content:staff?.content,
            time: staff?.time,
            _id:staff?._id,
            createdAt:staff?.createdAt
          });
        }
        this.totalLength = decryptedData.body?.totalRecords;
        this.dataSource=data;
     
    });
  }

  getNotificationById(){
    const params={
      _id:this.notification_id ,
    }
    this._superAdminService.notificationListById(params).subscribe((res) => {
    let data = this._coreService.decryptObjectData({ data: res });

    this.notificationDetails.patchValue({
      notification_name:data?.data?.notification_name,
      notification_type:data?.data?.notification_type,
      time:data?.data?.time,
      notification_applies:data?.data?.notification_applies,
      content:data?.data?.content
    })
    });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllNotificationlist();
  }

  handleSearchFilter(event: any){
    this.searchText = event.target.value;
    this.getAllNotificationlist();
  }

  clearFilter() {
    this.searchText = "",
    this.getAllNotificationlist();
  }

  get f() {
    return this.notificationDetails.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.notificationDetails.invalid) {
      console.log("======INVALID======");
      this.toastr.error("All Fields are required.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      ...this.notificationDetails.value,
      created_by: this.userID,
      created_by_type:"super-admin",
      notificationId :this.notification_id,
      // notitype:"super-admin-notification-to-all"
    };

    this._superAdminService.addNotification(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllNotificationlist();
        this.notificationDetails.reset();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  deleteSingleNotification(){
    this.loader.start();
    const reqData={
      _id:this.notification_id
    }
    this._superAdminService.deleteNotification(reqData).subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });
      if(data?.status){
        this.loader.stop();
        this.toastr.success(data.message);
        this.getAllNotificationlist();
        this.closePopup();
      }
    });
  }

}
