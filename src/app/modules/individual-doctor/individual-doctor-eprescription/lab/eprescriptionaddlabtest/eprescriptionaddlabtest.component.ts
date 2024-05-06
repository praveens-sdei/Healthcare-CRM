import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-eprescriptionaddlabtest",
  templateUrl: "./eprescriptionaddlabtest.component.html",
  styleUrls: ["./eprescriptionaddlabtest.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionaddlabtestComponent implements OnInit {
  filterForm: any = FormGroup;
  addLabForm: any = FormGroup;
  isSubmitted: boolean = false;
  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      height: [""],
      weight: [""],
      bmi: [""],
      bmi_inetpreter: [""],
      liver_failure: [""],
      renal_failure: [""],
      accident_related: [false],
      occupational_desease: [false],
      free_of_charge: [false],
    });

    this.addLabForm = this.fb.group({
      blood_count: ["", [Validators.required]],
      relevant_clinical_information: [""],
      specific_instruction: [""],
      comment: [""],
    });
  }

  ngOnInit(): void {}

  handleAddLabTest() {
    this.isSubmitted = true;
    if (this.addLabForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    console.log("LAB DATA=====>", this.addLabForm.value);
  }

  get validate() {
    return this.addLabForm.controls;
  }
}
