import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IndiviualDoctorService } from '../../individual-doctor/indiviual-doctor.service';
import { CoreService } from 'src/app/shared/core.service';
import { FourPortalService } from '../four-portal.service';


export interface PeriodicElement {
  patientname: string;
  doctorname: string;
  appointmentdatetime: string;
  payment: string;
  paymentdate: string;
  paymentmode: string;
  appointmentstatus: string;
  transactionid: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { patientname: 'Cameron Williamson', doctorname: 'Dr. Arlene McCoy', appointmentdatetime: '08-21-2022 | 03:00 - 03:50Pm', payment: '10 000 CFA', paymentdate: '08-21-2022', paymentmode: 'Stripe', appointmentstatus: 'Approved', transactionid: 'ch_1LiXjyC0CeWhUte5ynkgAqt0', },
]


@Component({
  selector: 'app-four-portal-paymenthistory',
  templateUrl: './four-portal-paymenthistory.component.html',
  styleUrls: ['./four-portal-paymenthistory.component.scss']
})
export class FourPortalPaymenthistoryComponent implements OnInit {

  displayedColumns: string[] = ['patientname', 'doctorname', 'appointmentdatetime', 'payment', 'paymentdate', 'paymentmode', 'appointmentstatus', 'transactionid',];
  dataSource = ELEMENT_DATA;
  doctor_portal_id: any = '';
  paymentHistory: any = [];

  searchTextP: any = '';
  searchTextD: any = '';
  page: any = 1;
  limit: any = 5
  appointmentStatus: any = '';
  appointmentStartDate: any = '';
  appointmentEndDate: any = '';

  totalCount:any = 0;
  totalAmount:any = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userRole: any;
  userType: any;

  constructor(
    private modalService: NgbModal,
    private _doctorService: IndiviualDoctorService,
    private fourPortal: FourPortalService,
    private _coreService: CoreService) {

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;
    this.userType= loginData?.type;
    if(this.userRole === "HOSPITAL_STAFF"){
      this.doctor_portal_id = adminData?.for_doctor;

    }else if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF"){
      this.doctor_portal_id = adminData?.in_hospital;
    }else{
      this.doctor_portal_id = loginData?._id;

    }
  }

  ngOnInit(): void {
   
    this.patientPaymentHistoryListToDoc();
  }

  patientPaymentHistoryListToDoc() {
    console.log(this.doctor_portal_id, "doctor_portal_idddd____");

    let data = {
      four_portal_id: this.doctor_portal_id,
      page: this.page,
      limit: this.limit,
      searchTextP: this.searchTextP,
      searchTextD: this.searchTextD,
      appointmentStatus: this.appointmentStatus,
      appointmentStartDate: this.appointmentStartDate,
      appointmentEndDate: this.appointmentEndDate,
      type:this.userType
    }

    this.fourPortal.patientPaymentHistoryToFourPortal(data).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response, "responseeeeee_____");

      this.paymentHistory = response.data.paymentHistory;
      this.totalAmount = response.data.totalAmount;
      this.totalCount = response.data.totalCount;
      
      this.dataSource = [];
      let historyList = []
      for (let history of this.paymentHistory) {
        historyList.push(
          {
            patientName: history.patientDetails.patientFullName,
            doctorName: history.doctorDetails.full_name,
            appointmentDate: history.consultationDate,
            appointmentTime: history.consultationTime,
            appointmentStatus: history.status,
            paymentDetails: history.paymentDetails,
            payementMode:history.paymentMode
          }
        )
      }
      this.dataSource = historyList;

      console.log(this.dataSource, "responseeeeee_____", this.paymentHistory);
    })
  }

  handlePageEvent(data: any) {
    console.log(data, "atatttttt____");

    this.page = data.pageIndex + 1;
    this.limit = data.pageSize;
    this.patientPaymentHistoryListToDoc();
  }

  handleSearchFilterPatient(event: any) {
    this.searchTextP = event.target.value;
    this.patientPaymentHistoryListToDoc();
  }

  handleSearchFilterDoctor(event: any) {
    this.searchTextD = event.target.value;
    this.patientPaymentHistoryListToDoc();
  }

  selectRange(event: any) {
    console.log(event, "ebentttt_____");
  }

  selectAppointmentStatus(event: any): void {
    this.appointmentStatus = event.value;
    console.log('Selected_Appointments:', event);
    this.patientPaymentHistoryListToDoc();
  }

  handleSelectStartDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    console.log("originalDateeeStart_____",originalDate);   
    this.extendDateFormat(originalDate)
    const formattedDate = originalDate.toISOString();
    this.appointmentStartDate = formattedDate
    console.log(this.appointmentStartDate,"appointmentStartDatee_");
    
    this.patientPaymentHistoryListToDoc()
  }

  handleSelectEndDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)     
    const formattedDate = originalDate.toISOString();
    this.appointmentEndDate = formattedDate
    this.patientPaymentHistoryListToDoc();
  } 

  clearAll() {
    this.searchTextP = "";
    this.searchTextD = "";
    this.appointmentStatus = "";
    this.appointmentStartDate = "";
    this.appointmentEndDate = "";
    this.patientPaymentHistoryListToDoc();
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
