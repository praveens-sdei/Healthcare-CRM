import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../hospital.service';


export interface PeriodicElement {
  patientname: string;
  doctorname: string;
  portaltype:string;
  appointmentdatetime: string;
  payment:string;
  paymentdate:string;
  paymentmode:string;
  appointmentstatus: string;
  transactionid:string;
}

const ELEMENT_DATA: PeriodicElement[] = []


@Component({
  selector: 'app-hospital-paymenthistory',
  templateUrl: './hospital-paymenthistory.component.html',
  styleUrls: ['./hospital-paymenthistory.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class HospitalPaymenthistoryComponent implements OnInit {

  displayedColumns: string[] = ['patientname', 'doctorname','portaltype', 'appointmentdatetime','payment','paymentdate','paymentmode','appointmentstatus','transactionid',];
  dataSource = ELEMENT_DATA;

  userRole: any;
  userPermission: any;
  hospitalId:any;

  startDateFilter: any="";
  endDateFilter: any="";
  selectedYear: number;
  years: number[] = [];
  graphyear: number;
  totalAmountInCFA:number = 0;

  page: any = 1;
  searchtext:any='';
  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';

  searchTextP: any = '';
  searchTextD: any = '';
  limit: any = 5;
  appointmentStatus: any = '';
  appointmentStartDate: any = '';
  appointmentEndDate: any = '';

  totalCount:any = 0;
  totalAmount:any = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private modalService: NgbModal,
    private _coreService: CoreService,
    private _hospitalService: HospitalService,) {
      let userData = this._coreService.getLocalStorage('loginData')
      this.userRole = userData?.role;
      this.hospitalId = userData?._id;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllpaymentDetails(`${column}:${this.sortOrder}`);
  }
 
  ngOnInit(): void {
    this.getAllpaymentDetails(`${this.sortColumn}:${this.sortOrder}`);
  }

  getAllpaymentDetails(sort:any='') {
    let reqData = {
      hospital_id: this.hospitalId,
      page: this.page,
      limit: this.limit,
      searchTextP: this.searchTextP,
      searchTextD: this.searchTextD,
      appointmentStatus: this.appointmentStatus,
      appointmentStartDate: this.appointmentStartDate,
      appointmentEndDate: this.appointmentEndDate,
      sort:sort
    };

    this._hospitalService.gethospitalpaymentHistory(reqData).subscribe(async (res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response________", response)
      const data = []
      if (response.status) {
        for (const appoint of response?.data?.result) {
          data.push({
            patientname: appoint?.patientDetails?.patientFullName,
            doctorname: appoint?.full_name,
            portaltype:appoint?.portal_type,
            appointmentDate: appoint?.consultationDate,
            appointmentTime: appoint?.consultationTime,
            payment:appoint?.paymentDetails,
            paymentmode:appoint?.paymentMode,
            appointmentstatus: appoint?.status
          })
        }
      }
      this.dataSource = data;
      this.totalCount = response?.data?.totalCount;
      this.totalAmount = response?.data?.totalAmount;
    }
    );
  }


  handlePageEvent(data: any) {
    console.log(data, "atatttttt____");

    this.page = data.pageIndex + 1;
    this.limit = data.pageSize;
    this.getAllpaymentDetails();
  }

  handleSearchFilterPatient(event: any) {
    this.searchTextP = event.target.value;
    this.getAllpaymentDetails();
  }

  handleSearchFilterDoctor(event: any) {
    this.searchTextD = event.target.value;
    this.getAllpaymentDetails();
  }

  selectRange(event: any) {
    console.log(event, "ebentttt_____");
  }

  selectAppointmentStatus(event: any): void {
    this.appointmentStatus = event.value;
    console.log('Selected_Appointments:', event);
    this.getAllpaymentDetails();
  }

  handleSelectStartDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    console.log("originalDateeeStart_____",originalDate);   
    this.extendDateFormat(originalDate)
    const formattedDate = originalDate.toISOString();
    this.appointmentStartDate = formattedDate
    console.log(this.appointmentStartDate,"appointmentStartDatee_");
    
    this.getAllpaymentDetails()
  }

  handleSelectEndDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)     
    const formattedDate = originalDate.toISOString();
    this.appointmentEndDate = formattedDate
    this.getAllpaymentDetails();
  } 

  clearAll() {
    this.searchTextP = "";
    this.searchTextD = "";
    this.appointmentStatus = "";
    this.appointmentStartDate = "";
    this.appointmentEndDate = "";
    this.getAllpaymentDetails();
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

}
