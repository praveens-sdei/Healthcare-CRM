import { Component, OnInit, ViewEncapsulation,ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


// Details table
export interface InsuranceElement {
  hospitalisationsfeesitem: string;
  tobepaidbypatient: string;
  maximumcost: string;
  unitcost: string;
  quantity:string;
  totalcostperservice:string;
  comments:string;
}

const INSURANCE_DATA: InsuranceElement[] = [
  { 
    hospitalisationsfeesitem: 'Hospitalization Room',
    tobepaidbypatient: '20%', 
    maximumcost: '30000 CFA / Day',
    unitcost: '3000 CFA',
    quantity:'1',
    totalcostperservice:'3000 CFA',
    comments:'It is a long established fact that a reader will be distracted by the readable content of',
  },
  { 
    hospitalisationsfeesitem: 'Hospitalization Room',
    tobepaidbypatient: '20%', 
    maximumcost: '30000 CFA / Day',
    unitcost: '3000 CFA',
    quantity:'1',
    totalcostperservice:'3000 CFA',
    comments:'It is a long established fact that a reader will be distracted by the readable content of',
  },  { 
    hospitalisationsfeesitem: 'Hospitalization Room',
    tobepaidbypatient: '20%', 
    maximumcost: '30000 CFA / Day',
    unitcost: '3000 CFA',
    quantity:'1',
    totalcostperservice:'3000 CFA',
    comments:'It is a long established fact that a reader will be distracted by the readable content of',
  },
  { 
    hospitalisationsfeesitem: 'Hospitalization Room',
    tobepaidbypatient: '20%', 
    maximumcost: '30000 CFA / Day',
    unitcost: '3000 CFA',
    quantity:'1',
    totalcostperservice:'3000 CFA',
    comments:'It is a long established fact that a reader will be distracted by the readable content of',
  }, 
]

@Component({
  selector: 'app-individual-doctor-otherpreauth',
  templateUrl: './individual-doctor-otherpreauth.component.html',
  styleUrls: ['./individual-doctor-otherpreauth.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class IndividualDoctorOtherpreauthComponent implements OnInit {

  // Details table
  displayedColumnss: string[] =   [
    'hospitalisationsfeesitem', 
    'tobepaidbypatient', 
    'maximumcost',
    'unitcost',
    'quantity',
    'totalcostperservice',
    'comments',
    'receptionistanalysis',
  ];
  dataSources = INSURANCE_DATA;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl('');
  filtereduser: Observable<string[]>;
  user: string[] = [];
  alluser: string[] = ['Reeve Ewer', 'Roy L. Commishun', 'Ray O’Sun', 'Rhoda Report',];
  
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement> | undefined;

  constructor() {
  
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
  

  ngOnInit(): void {
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };


}
