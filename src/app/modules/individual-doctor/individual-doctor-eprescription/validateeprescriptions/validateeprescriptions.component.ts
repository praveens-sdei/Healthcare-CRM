import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-validateeprescriptions",
  templateUrl: "./validateeprescriptions.component.html",
  styleUrls: ["./validateeprescriptions.component.scss"],
})
export class ValidateeprescriptionsComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}
  // Signature modal
  openVerticallyCenteredaddsignature(addsignature: any) {
    this.modalService.open(addsignature, {
      centered: true,
      size: "md",
      windowClass: "addsignature",
    });
  }
}
