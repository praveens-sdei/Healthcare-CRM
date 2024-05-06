import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


// Services table data
export interface ServicesPeriodicElement {
  services: string;
  addedby: string;
}
const SERVICES_ELEMENT_DATA: ServicesPeriodicElement[] = [
  { services: 'Lorem Ipsum', addedby: 'Hospital' },
  { services: 'Lorem Ipsum', addedby: 'Hospital' },
  { services: 'Lorem Ipsum', addedby: 'Hospital' },
  { services: 'Lorem Ipsum', addedby: 'Hospital' },
];


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

   // Services table data
   servicesdisplayedColumns: string[] = ['services', 'addedby', 'status', 'action'];
   servicesdataSource = SERVICES_ELEMENT_DATA;
 
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

}
