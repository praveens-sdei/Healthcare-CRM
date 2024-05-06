import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";

@Component({
  selector: "app-patient-mailbox",
  templateUrl: "./patient-mailbox.component.html",
  styleUrls: ["./patient-mailbox.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PatientMailboxComponent implements OnInit {
  public isCollapsed = true;
  isSubmitted: any = false;
  newMessageForm!: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.newMessageForm = this.fb.group({
      to: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      Cc: ["", [Validators.required]],
      subject: ["", [Validators.required]],
      body: ["", [Validators.required]],
      attachment:['']
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.isSubmitted = true;
    if (this.newMessageForm.invalid) {
      return;
    }
    console.log("New message", this.newMessageForm.value);
    //api call here
    this.isSubmitted = false;
    this.closePopup();
  }

  closePopup() {
    this.newMessageForm.reset();
    this.modalService.dismissAll("close");
  }

  handleRemoveAttachment(){
    console.log("Removed")
    console.log(this.newMessageForm.value)

    this.newMessageForm.patchValue({
      attachment:null
    })

    console.log(this.newMessageForm.value)
  }

  get messageFormControl(): { [key: string]: AbstractControl } {
    return this.newMessageForm.controls;
  }

  //  New Message modal
  openVerticallyCenterednewmsg(newmsgcontent: any) {
    this.modalService.open(newmsgcontent, {
      centered: true,
      size: "md",
      windowClass: "new_msg",
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
