import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  claimdate: string;
  insuranceid: string;
  plans: string;
  insuranceholder: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  comments: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { claimdate: '11/18/2019', insuranceid: '1234567890', plans: 'Lorem Ipsum is simply dummy', insuranceholder: 'Zodo Company', requestedamount: '15 000 CFA', totalamount: '25 000 CFA', approvedamount: '25 000 CFA', comments: 'Lorem Ipsum is simply dummy' },
  { claimdate: '11/18/2019', insuranceid: '1234567890', plans: 'Lorem Ipsum is simply dummy', insuranceholder: 'Zodo Company', requestedamount: '15 000 CFA', totalamount: '25 000 CFA', approvedamount: '25 000 CFA', comments: 'Lorem Ipsum is simply dummy' },
  { claimdate: '11/18/2019', insuranceid: '1234567890', plans: 'Lorem Ipsum is simply dummy', insuranceholder: 'Zodo Company', requestedamount: '15 000 CFA', totalamount: '25 000 CFA', approvedamount: '25 000 CFA', comments: 'Lorem Ipsum is simply dummy' },
]

export interface InsuranceElement {
  claimdate: string;
  insuranceid: string;
  plans: string;
  insuranceholder: string;
  reimbursmentrate: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  status: string;
  comments: string;
  insurancecontract: string;


}

const INSURANCE_DATA: InsuranceElement[] = [
  { claimdate: '11/18/2019', insuranceid: '1234567890', plans: 'Lorem Ipsum is simply dummy', insuranceholder: 'Zodo Company', reimbursmentrate: '80%', requestedamount: '15 000 CFA', totalamount: '25 000 CFA', approvedamount: '25 000 CFA', status: '', comments: 'Lorem Ipsum is simply dummy', insurancecontract: '' },
  { claimdate: '11/18/2019', insuranceid: '1234567890', plans: 'Lorem Ipsum is simply dummy', insuranceholder: 'Zodo Company', reimbursmentrate: '80%', requestedamount: '15 000 CFA', totalamount: '25 000 CFA', approvedamount: '25 000 CFA', status: '', comments: 'Lorem Ipsum is simply dummy', insurancecontract: '' },
  { claimdate: '11/18/2019', insuranceid: '1234567890', plans: 'Lorem Ipsum is simply dummy', insuranceholder: 'Zodo Company', reimbursmentrate: '80%', requestedamount: '15 000 CFA', totalamount: '25 000 CFA', approvedamount: '25 000 CFA', status: '', comments: 'Lorem Ipsum is simply dummy', insurancecontract: '' },
]


export interface DetailElement {
  hospitalisationsfeesitem: string;
  tobepaidbythepatient: string;
  maximumcost: string;
  unitcost: string;
  quantity: string;
  totalcostperservice: string;
  comments: string;
  receptionistanalysis: string;


}

const DETAIL_DATA: DetailElement[] = [
  { hospitalisationsfeesitem: 'Hospitalization Room', tobepaidbythepatient: '20%', maximumcost: '30000 CFA / Day', unitcost: '3000 CFA', quantity: '1', totalcostperservice: '3000 CFA', comments: 'It is a long established fact that a reader will be distracted by the readable content of', receptionistanalysis: '', },
  { hospitalisationsfeesitem: 'Hospitalization Room', tobepaidbythepatient: '20%', maximumcost: '30000 CFA / Day', unitcost: '3000 CFA', quantity: '1', totalcostperservice: '3000 CFA', comments: 'It is a long established fact that a reader will be distracted by the readable content of', receptionistanalysis: '', },
  { hospitalisationsfeesitem: 'Total', tobepaidbythepatient: '', maximumcost: '58000 CFA', unitcost: '3000 CFA', quantity: '1', totalcostperservice: '3000 CFA', comments: 'It is a long established fact that a reader will be distracted by the readable content of', receptionistanalysis: '', },
]


export interface PrimaryinsuranceElement {
  drugspeciality: string;
  druggenericname: string;
  drugdosage: string;
  quantityprescribed: string;
  quantitydelivered: string;
  paidbytheinsured: string;
  totalamount: string;
  approvedamount: string;
  medicalanalysis: string;
  comments: string;


}

const PRIMARYINSURANCE_DATA: PrimaryinsuranceElement[] = [
  { drugspeciality: '11/18/2019', druggenericname: '1234567890', drugdosage: 'Lorem Ipsum is simply dummy', quantityprescribed: 'Zodo Company', quantitydelivered: '3 boîtes', paidbytheinsured: '80%', totalamount: '15 000 CFA', approvedamount: '25 000 CFA', medicalanalysis: '', comments: 'Lorem Ipsum is simply dummy' },
  { drugspeciality: '11/18/2019', druggenericname: '1234567890', drugdosage: 'Lorem Ipsum is simply dummy', quantityprescribed: 'Zodo Company', quantitydelivered: '3 boîtes', paidbytheinsured: '80%', totalamount: '15 000 CFA', approvedamount: '25 000 CFA', medicalanalysis: '', comments: 'Lorem Ipsum is simply dummy' },
  { drugspeciality: '11/18/2019', druggenericname: '1234567890', drugdosage: 'Lorem Ipsum is simply dummy', quantityprescribed: 'Zodo Company', quantitydelivered: '3 boîtes', paidbytheinsured: '80%', totalamount: '15 000 CFA', approvedamount: '25 000 CFA', medicalanalysis: '', comments: 'Lorem Ipsum is simply dummy' },
  { drugspeciality: '11/18/2019', druggenericname: '1234567890', drugdosage: 'Lorem Ipsum is simply dummy', quantityprescribed: 'Zodo Company', quantitydelivered: '3 boîtes', paidbytheinsured: '80%', totalamount: '15 000 CFA', approvedamount: '25 000 CFA', medicalanalysis: '', comments: 'Lorem Ipsum is simply dummy' },
]
@Component({
  selector: 'app-insurance-preauthorizationhospitalization',
  templateUrl: './insurance-preauthorizationhospitalization.component.html',
  styleUrls: ['./insurance-preauthorizationhospitalization.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsurancePreauthorizationhospitalizationComponent implements OnInit {


  displayedColumns: string[] = ['claimdate', 'insuranceid', 'plans', 'insuranceholder', 'requestedamount', 'totalamount', 'approvedamount', 'comments'];
  dataSource = ELEMENT_DATA;

  displayedColumnss: string[] = ['claimdate', 'insuranceid', 'plans', 'insuranceholder', 'reimbursmentrate', 'requestedamount', 'totalamount', 'approvedamount', 'status', 'comments', 'insurancecontract',];
  dataSources = INSURANCE_DATA;

  displayedColumnses: string[] = ['hospitalisationsfeesitem', 'tobepaidbythepatient', 'maximumcost', 'unitcost', 'quantity', 'totalcostperservice', 'comments', 'receptionistanalysis',];
  dataSourceses = DETAIL_DATA;

  displayedColumn: string[] = ['drugspeciality', 'druggenericname', 'drugdosage', 'quantityprescribed', 'quantitydelivered', 'paidbytheinsured', 'totalamount', 'approvedamount', 'medicalanalysis', 'comments',];
  dataSourcee = PRIMARYINSURANCE_DATA;


  public doughnutChart2Datasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [200, 800],
      label: 'Reputation',
      backgroundColor: ['#FFD57A', '#62D94F'],
      hoverBackgroundColor: ['#FFD57A', '#62D94F'],
      hoverBorderColor: ['#FFD57A', '#62D94F'],
      borderWidth: 0,
      hoverBorderWidth: 0,
    }
  ];

  public doughnutChart2Options: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true
  };

  // Doughnut chart
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [200, 800],
      label: 'Reputation',
      backgroundColor: ['#FFD57A', '#4F90F2'],
      hoverBackgroundColor: ['#FFD57A', '#4F90F2'],
      hoverBorderColor: ['#FFD57A', '#4F90F2'],
      borderWidth: 0,
      hoverBorderWidth: 0,
    }
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true
  };

  // serahc dropdown
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl('');
  filtereduser: Observable<string[]>;
  user: string[] = [];
  alluser: string[] = ['Reeve Ewer', 'Roy L. Commishun', 'Ray O’Sun', 'Rhoda Report',];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private modalService: NgbModal) {

    this.filtereduser = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => (user ? this._filter(user) : this.alluser.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our user
    if (value) {
      this.user.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.user.indexOf(user);

    if (index >= 0) {
      this.user.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.user.push(event.option.viewValue);
    // this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.alluser.filter(user => user.toLowerCase().includes(filterValue));
  }

  openVerticallyCenteredsecond(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, { centered: true, size: 'xl   ' });
  }


  openVerticallyCenteredrequestedamount(requestedamount: any) {
    this.modalService.open(requestedamount, { centered: true, size: 'md   ' });
  }

  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, { centered: true, size: 'md   ' });
  }

  openVerticallyCenteredwanttosign(wanttosign: any) {
    this.modalService.open(wanttosign, { centered: true, size: 'md   ' });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  openVerticallyCenteredaddresponse(addresponse: any) {
    this.modalService.open(addresponse, { centered: true, size: 'xl' });
  }

  ngOnInit(): void {
  }

}
