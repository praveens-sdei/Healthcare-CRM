import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Pending request table 
export interface PendingPeriodicElement {
  date: string;
  claimfrom: string;
  prescribercentre: string;
  claimid: string;
  insuranceprovider: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  comments: string;
  status: string;
}
const PENDING_ELEMENT_DATA: PendingPeriodicElement[] = [
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
];

// Approved request table 
export interface ApprovedPeriodicElement {
  date: string;
  claimfrom: string;
  prescribercentre: string;
  claimid: string;
  insuranceprovider: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  comments: string;
  status: string;
}
const APPROVED_ELEMENT_DATA: ApprovedPeriodicElement[] = [
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
];

// Reject request table 
export interface RejectPeriodicElement {
  date: string;
  claimfrom: string;
  prescribercentre: string;
  claimid: string;
  insuranceprovider: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  comments: string;
  status: string;
}
const REJECT_ELEMENT_DATA: RejectPeriodicElement[] = [
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },
  { date: "11/18/2019", claimfrom: "Hospital", prescribercentre: "Hospital", claimid: "YYMMDDSSSS", insuranceprovider: "Zoodo Insurance", insuranceholder: "Zodo Company", insuranceid: "1234567890", patient: "Adama Traore", reimbursmentrate: "80%", paidbypatient: "2 000 CFA ", requestedamount: "8 000 CFA", totalamount: "10 000 CFA", approvedamount: "10 000 CFA", comments: "Lorem Ipsum is simply dummy text of", status: "Rejected" },

];

@Component({
  selector: 'app-super-admin-totaleclaims',
  templateUrl: './super-admin-totaleclaims.component.html',
  styleUrls: ['./super-admin-totaleclaims.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminTotaleclaimsComponent implements OnInit {

  // all Source request table 
  allSourcedColumns: string[] = ['date', 'claimfrom', 'prescribercentre', 'claimid', 'insuranceprovider', 'insuranceholder', 'insuranceid', 'patient', 'reimbursmentrate', 'paidbypatient', 'requestedamount', 'totalamount', 'approvedamount', 'comments', 'status', 'action'];
  allSource = new MatTableDataSource<PendingPeriodicElement>(PENDING_ELEMENT_DATA);

  // Hospital request table 
  approveddisplayedColumns: string[] = ['date', 'claimfrom', 'prescribercentre', 'claimid', 'insuranceprovider', 'insuranceholder', 'insuranceid', 'patient', 'reimbursmentrate', 'paidbypatient', 'requestedamount', 'totalamount', 'approvedamount', 'comments', 'status', 'action'];
  approveddataSource = new MatTableDataSource<ApprovedPeriodicElement>(APPROVED_ELEMENT_DATA);

  // Doctor request table 
  rejectdisplayedColumns: string[] = ['date', 'claimfrom', 'prescribercentre', 'claimid', 'insuranceprovider', 'insuranceholder', 'insuranceid', 'patient', 'reimbursmentrate', 'paidbypatient', 'requestedamount', 'totalamount', 'approvedamount', 'comments', 'status', 'action'];
  rejectdataSource = new MatTableDataSource<RejectPeriodicElement>(REJECT_ELEMENT_DATA);

  // Patient request table 
  rejectdisplayedColumns1: string[] = ['date', 'claimfrom', 'prescribercentre', 'claimid', 'insuranceprovider', 'insuranceholder', 'insuranceid', 'patient', 'reimbursmentrate', 'paidbypatient', 'requestedamount', 'totalamount', 'approvedamount', 'comments', 'status', 'action'];
  rejectdataSource1 = new MatTableDataSource<RejectPeriodicElement>(REJECT_ELEMENT_DATA);

  // Pharmacy request table 
  rejectdisplayedColumns2: string[] = ['date', 'claimfrom', 'prescribercentre', 'claimid', 'insuranceprovider', 'insuranceholder', 'insuranceid', 'patient', 'reimbursmentrate', 'paidbypatient', 'requestedamount', 'totalamount', 'approvedamount', 'comments', 'status', 'action'];
  rejectdataSource2 = new MatTableDataSource<RejectPeriodicElement>(REJECT_ELEMENT_DATA);



  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.allSource.paginator = this.paginator;
    this.approveddataSource.paginator = this.paginator;
    this.rejectdataSource.paginator = this.paginator;
  }

  constructor() {

  }

  ngOnInit(): void {
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

}
