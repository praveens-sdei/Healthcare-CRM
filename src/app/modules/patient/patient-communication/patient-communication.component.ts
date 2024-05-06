import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-communication',
  templateUrl: './patient-communication.component.html',
  styleUrls: ['./patient-communication.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PatientCommunicationComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

    //  Start chat modal
    openVerticallyCenteredstartchat(startchatcontent: any) {
      this.modalService.open(startchatcontent, { centered: true,size: 'md',windowClass : "start_chat" });
    }

    //  Create Group modal
    openVerticallyCenteredcreategroup(creategroupcontent: any) {
      this.modalService.open(creategroupcontent, { centered: true,size: 'md',windowClass : "start_chat" });
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
