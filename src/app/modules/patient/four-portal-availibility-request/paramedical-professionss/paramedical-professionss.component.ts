import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { IOrderCountRequest, IOrderCountResponse, IOrderList, IOrderListRequest, IOrderListResponse, IOrderStatus } from '../../patient-prescriptionorder/prescriptionorder/prescriptionorder.type';
import { PatientService } from '../../patient.service';
export interface PeriodicElement {
  patientname: string;
  orderid: string;
  dateandtime: string;
  status: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-paramedical-professionss',
  templateUrl: './paramedical-professionss.component.html',
  styleUrls: ['./paramedical-professionss.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParamedicalProfessionssComponent implements OnInit {

  //  New order table
  neworderdisplayedColumns: string[] = ['dateandtime','patientname', 'orderid', 'status', 'action'];

  //  Completed table
  completeddisplayedColumns: string[] = ['dateandtime','patientname', 'orderid', 'status', 'action'];

  //  Cancelled table
  //  Rejected table
  // rejecteddisplayedColumns: string[] = ['patientname', 'orderid', 'dateandtime','status','action'];

  dataSource = new MatTableDataSource<PeriodicElement>();

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
  orderList: [] = [];

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';

  @ViewChild("priceTab", { static: false }) tab: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  loginUserID: string = ''
  constructor(
    private patientService: PatientService,
    private coreService: CoreService,
    private router: Router
  ) {
    let userData = this.coreService.getLocalStorage("loginData");
    this.loginUserID = userData._id;
  }

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
      for_portal_user: "",
      portal: "patient",
      patient_id: this.loginUserID,
      request_type: "availability_request",
      portal_type: "Paramedical-Professions"
    }
    this.patientService.totalcountallPortal(orderCountRequest).subscribe({
      next: (result1) => {
        // this.coreService.showSuccess("", "Fetched order list successfully");
        let encryptedData = { data: result1 };
        let result = this.coreService.decryptObjectData(encryptedData);
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

  public getOrderList(sort: any = ''): void {
    const orderListRequest = {
      end_date: this.endDate,
      start_date: this.startDate,
      limit: this.pageSize,
      name: "",
      request_type: "availability_request",
      page: this.page,
      status: this.orderStatus,
      for_portal_user: "",
      portal: "patient",
      patient_id: this.loginUserID,
      sort: sort,
      portal_type: "Paramedical-Professions"
    };
    console.log("orderListRequest========", orderListRequest);

    this.patientService.orderlistallfourPortal(orderListRequest).subscribe({
      next: (result1) => {
        let encryptedData = { data: result1 };
        let result = this.coreService.decryptObjectData(encryptedData);
        // this.coreService.showSuccess("", "Fetched order list successfully");
        if (result.status === true) {
          console.log("KUNAL>>>>>>>>>>", result);

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
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.orderList);
    console.log("this.dataSource======", this.dataSource);

  }

  public getOrderStatusCount(status) {
    const orderCountData = this.orderCount.find(
      (data) => data._id === status
    );
    // console.log("orderCountData------------",orderCountData);

    return orderCountData ? orderCountData.count : 0;
  }
}







