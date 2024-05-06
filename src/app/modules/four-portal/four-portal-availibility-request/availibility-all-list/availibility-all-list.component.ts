import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { PatientService } from "src/app/modules/patient/patient.service";
import { IOrderCountResponse, IOrderList, IOrderStatus } from "src/app/modules/patient/patient-prescriptionorder/prescriptionorder/prescriptionorder.type";

@Component({
  selector: 'app-availibility-all-list',
  templateUrl: './availibility-all-list.component.html',
  styleUrls: ['./availibility-all-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AvailibilityAllListComponent implements OnInit {
  //  New order table
  neworderdisplayedColumns: string[] = [
    "dateandtime",
    "patientname",
    "orderid",
    "status",
    "action",
  ];

  //  Completed table
  completeddisplayedColumns: string[] = [
    "dateandtime",
    "patientname",
    "orderid",
    "status",
    "action",
  ];

  //  Cancelled table


  //  Rejected table
  // rejecteddisplayedColumns: string[] = [
  //   "patientname",
  //   "orderid",
  //   "dateandtime",
  //   "status",
  //   "action",
  // ];

  dataSource = new MatTableDataSource<IOrderList>();

  pageSize: number = 5;
  totalLength: number = 0;
  page: number = 1;
  orderStatus: IOrderStatus = "new";
  orderStatusList: IOrderStatus[] = [
    "new",
    "accepted",
    "rejected",
  ];
  startDate: string = null;
  endDate: string = null;
  public selectedTabIndex = 0;
  orderCount: IOrderCountResponse[] = [];
  orderList: IOrderList[] = [];

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';

  @ViewChild("availiabilityTab", { static: false }) tab: MatTabGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userId: any;
  userRole: any;
  userType: any;
  innerMenuPremission:any=[];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private coreService: CoreService,
    private router: Router,
    private patientService: PatientService,
    
  ) {
    let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.userId = adminData.creatorId;

    }else{
      this.userId = userData._id;

    }
  }



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
    let userPermission = this.coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log("checkData________",checkData);
    
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("price-availibility")) {
          this.innerMenuPremission = checkSubmenu['price-availibility'].inner_menu;
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
    console.log(data, "::::: selected page :::::");
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
    console.log(data, "::::: selected tab :::::");
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
    console.log(
      new Date(this.startDate),
      new Date(this.endDate),
      "::: date range ::::"
    );
  }

  public onEndDateChange(data: MatDatepickerInputEvent<Date>): void {
    console.log(data.value, ":::: end date ::::");
    this.getAllOrders();
  }

  public onStartDateChange(data: MatDatepickerInputEvent<Date>): void {
    console.log(data.value, ":::: start date :::::");
    this.getAllOrders();
  }

  public getOrderCount(): void {
    const orderCountRequest = {
      for_portal_user: this.userId,
      portal: this.userType,
      patient_id: "",
      request_type: "availability_request",
      portal_type:this.userType
    }
    this.patientService.totalcountallPortal(orderCountRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order list successfully");
        if (result.status === true) {
          this.orderCount = result.data;
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
    const orderListRequest = {
      end_date: this.endDate,
      start_date: this.startDate,
      limit: this.pageSize,
      name: "",
      request_type: "availability_request",
      page: this.page,
      status: this.orderStatus,
      for_portal_user: this.userId,
      portal:this.userType,
      patient_id: "",
      sort:sort,
      portal_type: this.userType
    };
    this.patientService.orderlistallfourPortal(orderListRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order list successfully");
        if (result.status === true) {
          console.log("result--------",result);
          
          this.orderList = result.data.order_list;
          this.totalLength = result.data.total_count;
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

  goTodetailsPage(orderid:any){
    this.router.navigate([`/portals/availibility-request/${this.userType}/availibility-test-details`], { queryParams: {orderId: orderid}});

  }

  gotoCompletePage(orderid:any){
    this.router.navigate([`/portals/availibility-request/${this.userType}/complete-test-availibility`], { queryParams: {orderId: orderid}});

  }
}
