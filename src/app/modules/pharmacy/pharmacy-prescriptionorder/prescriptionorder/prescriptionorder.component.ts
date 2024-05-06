import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../../pharmacy.service";
import {
  IOrderCountRequest,
  IOrderCountResponse,
  IOrderList,
  IOrderListRequest,
  IOrderListResponse,
  IOrderStatus,
} from "./prescriptionorder.type";

@Component({
  selector: "app-prescriptionorder",
  templateUrl: "./prescriptionorder.component.html",
  styleUrls: ["./prescriptionorder.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PrescriptionorderComponent implements OnInit {
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

  @ViewChild("orderTab", { static: false }) tab: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userPermission: any;
  userRole: any;
  innerMenuPremission: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  userID: string = "";

  constructor(
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router
  ) {
    let userData = this.coreService.getLocalStorage('loginData')
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userPermission =userData.permissions;
    this.userRole = userData.role;
    
    if(this.userRole === "PHARMACY_STAFF"){
      this.userID = adminData?.for_staff;
    }else{
      this.userID = userData?._id;
    }
  }

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
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
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("order_request")) {
          this.innerMenuPremission = checkSubmenu['order_request'].inner_menu;  
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
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }

  giveInnerPermission(value){   
    if(this.userRole === "PHARMACY_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }

  async checkForPlan() {
    let isPurchased = await this.pharmacyService.isPlanPurchasedByPharmacy(
      this.userID
    );

    if (!isPurchased) {
      this.coreService.showError(
        "No plan purchsed! Please purches new plan",
        ""
      );
      this.router.navigate(["/pharmacy/pharmacysubscriptionplan"]);
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
    if (subscriber_id != null) {
      this.router.navigate(["/pharmacy/presciptionorder/neworder"], {
        queryParams: { orderId: order_id },
      });
    } else {
      this.router.navigate(["/pharmacy/presciptionorder/neworderrequest"], {
        queryParams: { orderId: order_id },
      });
    }
    // this.pharmacyService.patientProfile(patient_id, insuranceNo,subscriber_id).subscribe((res) => {
    //   let response = this.coreService.decryptObjectData({ data: res });
    //   if (response.status) {
    //     if (subscriber_id!=null) {
    //       this.router.navigate(['/pharmacy/presciptionorder/neworder'], { queryParams: {orderId: order_id}});
    //     } else {
    //       this.router.navigate(['/pharmacy/presciptionorder/neworderrequest'], { queryParams: {orderId: order_id}});
    //     }
    //   }
    // });
  }

  public getOrderCount(): void {
    const orderCountRequest: IOrderCountRequest = {
      for_portal_user: this.userID,
      portal: "pharmacy",
      patient_id: "",
      request_type: "order_request",
    };
    this.pharmacyService.orderCount(orderCountRequest).subscribe({
      next: (result: IResponse<IOrderCountResponse[]>) => {
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

  public getOrderList(sort:any=''): void {
    const orderListRequest: IOrderListRequest = {
      end_date: this.endDate,
      start_date: this.startDate,
      limit: this.pageSize,
      name: "",
      request_type: "order_request",
      page: this.page,
      status: this.orderStatus,
      for_portal_user: this.userID,
      portal: "pharmacy",
      patient_id: "",
      sort:sort
    };
    console.log("--------orderListRequest------>", orderListRequest);
    this.pharmacyService.orderList(orderListRequest).subscribe({
      next: (result: IResponse<IOrderListResponse>) => {
        let res = this.coreService.decryptObjectData({ data: result });
        // this.coreService.showSuccess("", "Fetched order list successfully");
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
    // console.log("orderCountData.............",orderCountData);

    return orderCountData ? orderCountData.count : 0;
  }
}
