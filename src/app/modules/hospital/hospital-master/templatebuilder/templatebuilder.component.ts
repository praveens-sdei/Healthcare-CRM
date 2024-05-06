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
  selector: 'app-templatebuilder',
  templateUrl: './templatebuilder.component.html',
  styleUrls: ['./templatebuilder.component.scss']
})
export class TemplatebuilderComponent implements OnInit {

  displayedColumns: string[] = ['templatename','templatecategory', 'templatesubcategory', 'action'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
