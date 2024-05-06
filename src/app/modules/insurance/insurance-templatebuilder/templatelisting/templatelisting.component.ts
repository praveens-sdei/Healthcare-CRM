import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  templatename: string;
  templatecategory: string;
  templatesubcategory: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { 
    templatename: 'Autism', 
    templatecategory: 'Soap',
    templatesubcategory: 'Paediatric'
  },
  { 
    templatename: 'Autism', 
    templatecategory: 'Soap',
    templatesubcategory: 'Paediatric'
  },
  { 
    templatename: 'Autism', 
    templatecategory: 'Soap',
    templatesubcategory: 'Paediatric'
  },
  { 
    templatename: 'Autism', 
    templatecategory: 'Soap',
    templatesubcategory: 'Paediatric'
  },
];


@Component({
  selector: 'app-templatelisting',
  templateUrl: './templatelisting.component.html',
  styleUrls: ['./templatelisting.component.scss']
})
export class TemplatelistingComponent implements OnInit {
  displayedColumns: string[] = ['templatename','templatecategory', 'templatesubcategory', 'action'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
