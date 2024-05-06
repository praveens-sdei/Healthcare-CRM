import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyService } from '../pharmacy.service';

export interface PeriodicElement {
  patientname: string;
  // insurancecompany: string;
  // hospitalname: string;
  payment:string;
  paymentdate:string;
  paymentmode:string;
  transactionid:string;
}

const ELEMENT_DATA: PeriodicElement[] = []


@Component({
  selector: 'app-pharmacy-paymenthistory',
  templateUrl: './pharmacy-paymenthistory.component.html',
  styleUrls: ['./pharmacy-paymenthistory.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PharmacyPaymenthistoryComponent implements OnInit {
  displayedColumns: string[] = ['paymentdate','patientname','payment','paymentmode','transactionid',];
  dataSource = ELEMENT_DATA;
  userRole: any;
  userPermission: any;
  pharmacyId:any;

  startDateFilter: any="";
  endDateFilter: any="";
  selectedYear: number;
  years: number[] = [];
  graphyear: number;
  totalAmountInCFA:number = 0;

  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  searchtext:any='';
  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('select') select: MatSelect;


  constructor(private modalService: NgbModal,
    private _coreService: CoreService,
    private _pharmacyService: PharmacyService,
  ) {
    let userData = this._coreService.getLocalStorage('loginData')
    this.userRole = userData?.role;
    this.pharmacyId = userData?._id;

    this.yeardropdown();
  }

  yeardropdown() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }

    this.selectedYear = currentYear;
    this.graphyear = currentYear;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter,`${column}:${this.sortOrder}`);
  }
 
  ngOnInit(): void {
    this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter,`${this.sortColumn}:${this.sortOrder}`);
  }

  getAllpaymentDetails(startyearDate, endyearDate,sort:any='') {
    let reqData = {
      pharmacyId: this.pharmacyId,
      createdDate: startyearDate,
      updatedDate: endyearDate,
      sort:sort,
      page: this.page,
      limit: this.pageSize,
      searchKey:this.searchtext
    };

    this._pharmacyService.getpaymentHistory(reqData).subscribe(async (res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response________", response)
      const data = []
      if (response.status) {
        for (const payment of response?.data?.result) {
          // this.totalAmountInCFA += parseInt(payment?.totalPayment)

          data.push({
            patientname: payment?.patientName,
            payment:payment?.totalPayment,
            transactionid:payment?.transaction_id,
            paymentmode:payment?.payment_mode,
            paymentdate:payment?.createdAt
          })
        }
      }
      this.dataSource = data;
      this.totalLength= response?.data?.totalCount;
      this.totalAmountInCFA = response?.data?.totalAmount;
    }
    );
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter)
  }

  // handleSearchFilter(text: any) {
  //   this.searchtext = text;
  //   console.log("searchFilter_________",this.searchtext)
  //   this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter)
  // }

  handleSearchFilter(event: any) {
    this.searchtext = event.target.value;
    this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter)
  }

  handleSelectStartDateFilter(event: any) {    
    this.selectedYear=this.years[""]
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate
    console.log( this.startDateFilter," this.startDateFilter " );
    this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter);
  }

  handleSelectEndDateFilter(event: any) {    
    this.selectedYear=this.years[""]
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate
    this.getAllpaymentDetails(this.startDateFilter,this.endDateFilter);
  }

  extendDateFormat(mydate){
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30); 
    return mydate
  }

  allSelected=false;
   foods: any[] = [
    {value: 'ASCOMA', viewValue: 'ASCOMA'},
    {value: 'Coris', viewValue: 'Coris'},
    {value: 'yelen', viewValue: 'yelen'}
  ];
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
   optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

}
