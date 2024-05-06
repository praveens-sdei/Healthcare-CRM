import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";

import { IOrderCountResponse, IOrderList, IOrderStatus } from "../../../patient/patient-prescriptionorder/prescriptionorder/prescriptionorder.type";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { PatientService } from "src/app/modules/patient/patient.service";

@Component({
  selector: 'app-price-all-list',
  templateUrl: './price-all-list.component.html',
  styleUrls: ['./price-all-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PriceAllListComponent implements OnInit {
  //  New order table
  neworderdisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    "status",
    "action",
  ];

  //  Completed table
  completeddisplayedColumns: string[] = [
    "dateandtime",
    "from",
    "patientname",
    "orderid",
    // "patientconfirmation",
    // // "paidbypatient",
    // // "insurancetobepaid",
    // // "totalmedicinecost",
    "status",
    "action",
  ];

  //  Cancelled table
 

  //  Rejected table
  // rejecteddisplayedColumns: string[] = [
  //   "from",
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

  @ViewChild("priceTab", { static: false }) tab: MatTabGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  route_type: string;
  userId: any;
  userRole: any;
  userType: any;
  innerMenuPremission:any=[];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private pharmacyService: PharmacyService,
    private patientService : PatientService,
    private coreService: CoreService,
    private router: Router,
    private activateRoute: ActivatedRoute,
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
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("price-request")) {
          this.innerMenuPremission = checkSubmenu['price-request'].inner_menu;
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
      request_type: "price_request",
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

  public handleOrderClick(patient_id: string, order_id: string, insuranceNo: any): void {
    console.log(patient_id, order_id);
    this.getPatientDetails(patient_id, order_id, insuranceNo)
  }

  public getPatientDetails(patient_id: string, order_id: string, insuranceNo: any) {
    this.pharmacyService.patientProfile(patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        if ('in_insurance' in response.body.profileData) {
          this.router.navigate([`/portals/price-request/${this.userType}/test-details`], { queryParams: {orderId: order_id}});
        } else {
          this.router.navigate([`/portals/price-request/${this.userType}/test-details`], { queryParams: {orderId: order_id}});
        }
      }
    });
  }

  gotocompleted(order_id:any){
    this.router.navigate([`/portals/price-request/${this.userType}/complete-test`], { queryParams: {orderId: order_id}});
  }
  public getOrderList(sort:any=''): void {
    const orderListRequest = {
      end_date: this.endDate,
      start_date: this.startDate,
      limit: this.pageSize,
      name: "",
      request_type: "price_request",
      page: this.page,
      status: this.orderStatus,
      for_portal_user: this.userId,
      portal: this.userType,
      patient_id: "",
      sort:sort,
      portal_type:this.userType
    };
    console.log("orderListRequest",orderListRequest);
    
    this.patientService.orderlistallfourPortal(orderListRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order list successfully");
        if (result.status === true) {
          this.orderList = result.data.order_list;
          console.log("ORDERLIST",this.orderList);
          
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
}
