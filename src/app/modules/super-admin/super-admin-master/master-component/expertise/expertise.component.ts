import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


// Expertise table data
export interface ExpertisePeriodicElement {
  expertise: string;
  addedby: string;
}
const EXPERTISE_ELEMENT_DATA: ExpertisePeriodicElement[] = [
  { expertise: 'Lorem Ipsum', addedby: 'Hospital' },
  { expertise: 'Lorem Ipsum', addedby: 'Hospital' },
  { expertise: 'Lorem Ipsum', addedby: 'Hospital' },
  { expertise: 'Lorem Ipsum', addedby: 'Hospital' },
];



@Component({
  selector: 'app-expertise',
  templateUrl: './expertise.component.html',
  styleUrls: ['./expertise.component.scss']
})

export class ExpertiseComponent implements OnInit {


  // Expertise table data
  expertisedisplayedColumns: string[] = ['expertise', 'addedby', 'status', 'action'];
  expertisedataSource = EXPERTISE_ELEMENT_DATA;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
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
}
