import { Component, OnInit } from '@angular/core';


// Unit table data
export interface unitPeriodicElement {
  unit: string;
  addedby: string;
}
const UNIT_ELEMENT_DATA: unitPeriodicElement[] = [
  { unit: 'Lorem Ipsum', addedby: 'Hospital' },
  { unit: 'Lorem Ipsum', addedby: 'Hospital' },
  { unit: 'Lorem Ipsum', addedby: 'Hospital' },
  { unit: 'Lorem Ipsum', addedby: 'Hospital' },
];



@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {


  // Unit table data
  unitdisplayedColumns: string[] = ['unit', 'addedby', 'status', 'action'];
  unitdataSource = UNIT_ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
