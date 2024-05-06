import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-validateimagingprescription',
  templateUrl: './validateimagingprescription.component.html',
  styleUrls: ['./validateimagingprescription.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ValidateimagingprescriptionComponent implements OnInit {


  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

    // Imaging modal
    openVerticallyCenteredaddsignature(addsignature: any) {
      this.modalService.open(addsignature, { centered: true, size: 'md', windowClass: "addsignature" });
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
