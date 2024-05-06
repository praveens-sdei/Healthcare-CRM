import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  name: string;
  linkto: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { 
    name: 'Lorem Ipsum is simply', 
    linkto: 'Both',
  },
  { 
    name: 'Lorem Ipsum is simply', 
    linkto: 'Both',
  },
  { 
    name: 'Lorem Ipsum is simply', 
    linkto: 'Both',
  },
  { 
    name: 'Lorem Ipsum is simply', 
    linkto: 'Both',
  },
];


@Component({
  selector: 'app-customfields',
  templateUrl: './customfields.component.html',
  styleUrls: ['./customfields.component.scss']
})
export class CustomfieldsComponent implements OnInit {


  displayedColumns: string[] = ['name','linkto', 'action'];
  dataSource = ELEMENT_DATA;

  constructor(private modalService: NgbModal) {}

  // Custom field modal
  openVerticallyCenteredaddcustomfield(addcustomfield: any) {
    this.modalService.open(addcustomfield, { centered: true,size:'' });
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


  ngOnInit(): void {
  }

}
