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
  cost: string;
  unitcost: string;
  quantity:string;
  totalcostperservice:string;
  comments:string;
}

const INSURANCE_DATA: InsuranceElement[] = [
  { 
    hospitalisationsfeesitem: '11/18/2019',
    cost: '1234567890', 
    unitcost: 'Lorem Ipsum is simply dummy',
    quantity:'Zodo Company',
    totalcostperservice:'80%',
    comments:'15 000 CFA',
  },
]


@Component({
  selector: 'app-individual-doctor-preauthhospitalization',
  templateUrl: './individual-doctor-preauthhospitalization.component.html',
  styleUrls: ['./individual-doctor-preauthhospitalization.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class IndividualDoctorPreauthhospitalizationComponent implements OnInit {
  // Details table
  displayedColumnss: string[] =   [
    'hospitalisationsfeesitem', 
    'cost', 
    'unitcost',
    'quantity',
    'totalcostperservice',
    'comments',
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
