import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-educationalcontent',
  templateUrl: './educationalcontent.component.html',
  styleUrls: ['./educationalcontent.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class EducationalcontentComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  
  // Upload Document modal
  openVerticallyCentereduploaddocs(uploaddocs: any) {
    this.modalService.open(uploaddocs, { centered: true,size:'', windowClass:'upload_docs' });
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
