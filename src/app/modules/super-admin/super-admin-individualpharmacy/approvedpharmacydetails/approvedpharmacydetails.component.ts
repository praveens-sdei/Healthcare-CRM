import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approvedpharmacydetails',
  templateUrl: './approvedpharmacydetails.component.html',
  styleUrls: ['./approvedpharmacydetails.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ApprovedpharmacydetailsComponent implements OnInit {


  constructor(private modalService: NgbModal) {
    
  }

  ngOnInit(): void {
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //  Delete modal
    openVerticallyCentereddetale(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, { centered: true,size: 'md'});
  }

  //  Block modal
    openVerticallyCenteredblock(block: any) {
    this.modalService.open(block, { centered: true,size: 'md'});
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
