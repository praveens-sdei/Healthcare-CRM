import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../super-admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
export interface PeriodicElement {
  transactionid: string;
  name: string;
  paymentby: string;
  paymenttype:string;
  amount:string;
  paymentmode:string;
  transactiondatetime:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // { transactionid: 'ch_1LiXjyC0CeWhUte5ynkgAqt0', name: 'Cameron Williamson', paymentby: 'Doctor',paymenttype:'Appointment Fee',amount:'10 000 CFA',paymentmode:'Stripe',transactiondatetime:'08-21-2022 | 03:00 - 03:50Pm',},
]

@Component({
  selector: 'app-super-admin-paymenthistory',
  templateUrl: './super-admin-paymenthistory.component.html',
  styleUrls: ['./super-admin-paymenthistory.component.scss'],
  encapsulation:ViewEncapsulation.None
})

export class SuperAdminPaymenthistoryComponent implements OnInit {
  startDateFilter: any="";
  endDateFilter: any="";
  searchText: any='';
  pageSize: number = 10;
  totalLength: number = 0;
  page: any = 1;

  displayedColumns: string[] = ['transactiondatetime','transactionid', 'name', 'paymentby','paymenttype','amount','paymentmode',];

  dataSource = ELEMENT_DATA;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalAmount: any;
  paymentType: any="";
  paymentBy:any="";

  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';

  constructor(private modalService: NgbModal,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private route:Router,
    private toastr: ToastrService) {
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getallPaymentHistory(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getallPaymentHistory(`${this.sortColumn}:${this.sortOrder}`)
  }

  handleSelectStartDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    console.log("originalDate",originalDate);   
    this.extendDateFormat(originalDate)
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate
    const inputDate = new Date(formattedDate);
    const nextDate = inputDate.setHours(23,59,59,59)
    this.endDateFilter = new Date (nextDate).toISOString()
    this.getallPaymentHistory()
  }
  handleSelectEndDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)     
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate
   
  } 


  extendDateFormat(mydate){
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30);
    return mydate
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getallPaymentHistory();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getallPaymentHistory();
  }

  clearAll(){
    this.startDateFilter ="";
    this.endDateFilter="";
    this.paymentType ="";
    this.paymentBy="";
    this.searchText="";
    this.getallPaymentHistory();
  }



  getallPaymentHistory(sort : any ='') {
    let reqData = {
      limit: this.pageSize,
      page: this.page,
      createdDate:this.startDateFilter,
      updatedDate:this.endDateFilter, 
       order_type:this.paymentType,
       portal:this.paymentBy,
      searchText:this.searchText,
      sort :sort
    };

    console.log(reqData,"<=============reqData");
    this.superAdminService.getallPaymentHistory(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("All Medicine claims ---->", response);
      this.dataSource = response?.body?.result;
       this.totalLength = response?.body?.totalRecords;
       this.totalAmount = response?.body?.totalAmount;
    });

  }

  handleFilter(value: any) {
    console.log("value--->", value);
    this.paymentType = value
    this.getallPaymentHistory();

  }

  handleFilterpaymentBy(value: any){
    console.log("value--->", value);
    this.paymentBy = value
    this.getallPaymentHistory();

  }

}