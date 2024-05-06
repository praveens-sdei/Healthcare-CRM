import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-eprescriptionaddimaging",
  templateUrl: "./eprescriptionaddimaging.component.html",
  styleUrls: ["./eprescriptionaddimaging.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionaddimagingComponent implements OnInit {
  filterForm: any = FormGroup;
  imagingForm: any = FormGroup;
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

    this.imagingForm = this.fb.group({
      mri: ["", [Validators.required]],
      relevant_clinical_information: [""],
      specific_instructions: [""],
      comment: [""],
    });
  }

  ngOnInit(): void {}

  handleAddImaging() {
    this.isSubmitted = true;
    if (this.imagingForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    console.log("IMAGING DATA===>", this.imagingForm.value);

    // routerLink="/individual-doctor/eprescription/eprescriptionimaging"
  }

  get formValidation() {
    return this.imagingForm.controls;
  }
}
