import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { IOrderCountResponse, IOrderList, IOrderStatus } from "src/app/modules/patient/patient-prescriptionorder/prescriptionorder/prescriptionorder.type";
import { PatientService } from "src/app/modules/patient/patient.service";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { CoreService } from "src/app/shared/core.service";


@Component({
  selector: 'app-four-portal-all-request-list',
  templateUrl: './four-portal-all-request-list.component.html',
  styleUrls: ['./four-portal-all-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FourPortalAllRequestListComponent implements OnInit {
  //  New order table
  neworderdisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource<IOrderList>();

  //  Accepted table
  accepteddisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "patientconfirmation",
    "paidbypatient",
    "insurancetobepaid",
    "totalmedicinecost",
    "status",
    "action",
  ];

  //  Scheduled table
  scheduleddisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "patientconfirmation",
    "payemttype",
    "status",
    "action",
  ];

  //  Completed table
  completeddisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "payemttype",
    "totalpayment",
    "status",
    "action",
  ];

  //  Cancelled table
  cancelleddisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "cancelby",
    "status",
    "action",
  ];

  //  Rejected table
  rejecteddisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "status",
    "action",
  ];

  pageSize: number = 5;
  totalLength: number = 0;
  page: number = 1;
  orderStatus: IOrderStatus = "new";
  orderStatusList: IOrderStatus[] = [
    "new",
    "accepted",
    "scheduled",
    "completed",
    "cancelled",
    "rejected",
  ];
  startDate: string = null;
  endDate: string = null;
  public selectedTabIndex = 0;
  orderCount: IOrderCountResponse[] = [];
  orderList: IOrderList[] = [];
  innerMenuPremission:any=[];

  @ViewChild("orderTab", { static: false }) tab: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userType: any;
  userRole: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  userID: string = "";

  constructor(
    private pharmacyService: PharmacyService,
    private patientService: PatientService,
    private coreService: CoreService,
    private router: Router
  ) {
    let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.userID = adminData.creatorId;

    }else{
      this.userID = userData._id;

    }


    // this.checkForPlan();
  }

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getOrderList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getOrderCount();
    this.resetDate();
    this.getOrderList(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this.coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log("checkData________",checkData);
    
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("order-request")) {
          this.innerMenuPremission = checkSubmenu['order-request'].inner_menu;
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
    }  
  }

  giveInnerPermission(value) {
    if (this.userRole === 'STAFF' || this.userRole === 'HOSPITAL_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  public handlePageEvent(data: { pageIndex: number; pageSize: number }): void {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.orderStatus = this.orderStatusList[this.selectedTabIndex];
    this.getOrderList();
  }

  public clearAll(): void {
    this.resetDate();
    this.getAllOrders();
  }

  private resetPagination(): void {
    this.page = 1;
    this.totalLength = 0;
  }

  private getAllOrders(): void {
    this.resetPagination();
    this.getOrderList();
  }

  public onTabChanged(data: { index: number }): void {
    this.orderStatus = this.orderStatusList[data.index];
    this.getAllOrders();
  }

  private lastYearDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString();
  }

  private resetDate(): void {
    this.startDate = this.lastYearDate();
    this.endDate = new Date().toISOString();
  }

  public onEndDateChange(data: MatDatepickerInputEvent<Date>): void {
    this.getAllOrders();
  }

  public onStartDateChange(data: MatDatepickerInputEvent<Date>): void {
    this.getAllOrders();
  }

  public handleOrderClick(
    patient_id: string,
    order_id: string,
    insuranceNo: any,
    subscriber_id: any
  ): void {
    this.getPatientDetails(patient_id, order_id, insuranceNo, subscriber_id);
  }

  public getPatientDetails(
    patient_id: string,
    order_id: string,
    insuranceNo: any,
    subscriber_id: any
  ) {
    console.log("check===");

    if (subscriber_id != null) {
      this.router.navigate([`/portals/order-request/${this.userType}/order-details`], {
        queryParams: { orderId: order_id },
      });
    } else {
      this.router.navigate([`/portals/order-request/${this.userType}/new-order-details`], {
        queryParams: { orderId: order_id },
      });
    }

  }

  public getOrderCount(): void {
    const orderCountRequest = {
      for_portal_user: this.userID,
      portal: this.userType,
      patient_id: "",
      request_type: "order_request",
      portal_type: this.userType
    };
    this.patientService.totalcountallPortal(orderCountRequest).subscribe({
      next: (result) => {
        // this.coreService.showSuccess("", "Fetched order list successfully");
        let response = this.coreService.decryptObjectData({ data: result });
        if (response.status === true) {
          this.orderCount = response.data;
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  public getOrderList(sort: any = ''): void {
    const orderListRequest = {
      end_date: this.endDate,
      start_date: this.startDate,
      limit: this.pageSize,
      name: "",
      request_type: "order_request",
      page: this.page,
      status: this.orderStatus,
      for_portal_user: this.userID,
      portal: this.userType,
      patient_id: "",
      sort: sort,
      portal_type: this.userType
    };
    this.patientService.orderlistallfourPortal(orderListRequest).subscribe({
      next: (result) => {
        let res = this.coreService.decryptObjectData({ data: result });
        if (res.status === true) {
          this.orderList = res.data.order_list;
          console.log(this.orderList, "tst");
          this.totalLength = res.data.total_count;
          this.updateTableDataSource();
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  public updateTableDataSource() {
    this.dataSource = new MatTableDataSource<IOrderList>(this.orderList);
    

  }

  public getOrderStatusCount(status: IOrderStatus) {

    const orderCountData = this.orderCount.find(
      (data: IOrderCountResponse) => data._id === status
    );

    return orderCountData ? orderCountData.count : 0;
  }

  submitclaimOrder(orderId: any, logginId: any) {
    this.router.navigate([`/portals/claims/${this.userType}/submitclaim`], {
      queryParams: { orderId: orderId, logginId: logginId },
    });
  }

  goToNextTab(type: any, order_id: any) {
    if (type === 'accept') {
      this.router.navigate([`/portals/order-request/${this.userType}/accepted-order`], {
        queryParams: { orderId: order_id },
      });
    } else if (type === 'schedule') {
      this.router.navigate([`/portals/order-request/${this.userType}/schedule-order`], {
        queryParams: { orderId: order_id },
      });
    } else if (type === 'complete') {
      this.router.navigate([`/portals/order-request/${this.userType}/completed-order`], {
        queryParams: { orderId: order_id },
      });
    } else if (type === 'cancel') {
      this.router.navigate([`/portals/order-request/${this.userType}/cancel-order`], {
        queryParams: { orderId: order_id },
      });
    } else if (type === 'reject') {
      this.router.navigate([`/portals/order-request/${this.userType}/reject-order`], {
        queryParams: { orderId: order_id },
      });
    }

  }

  handleDownloadPDF(data: any) {
    window.location.href = data;
  }

}

