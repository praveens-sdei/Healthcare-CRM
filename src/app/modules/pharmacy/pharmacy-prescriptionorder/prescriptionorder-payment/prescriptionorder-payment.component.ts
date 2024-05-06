import { Component, OnInit,ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prescriptionorder-payment',
  templateUrl: './prescriptionorder-payment.component.html',
  styleUrls: ['./prescriptionorder-payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrescriptionorderPaymentComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  // payment successfull modal
  openVerticallyCenteredpaymentcontent(paymentcontent: any) {
    this.modalService.open(paymentcontent, { centered: true, size: 'sm', windowClass: "payment_successfull" });
  }

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
