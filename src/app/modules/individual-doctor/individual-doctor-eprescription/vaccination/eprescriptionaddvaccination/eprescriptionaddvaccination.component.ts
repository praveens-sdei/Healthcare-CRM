import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-eprescriptionaddvaccination",
  templateUrl: "./eprescriptionaddvaccination.component.html",
  styleUrls: ["./eprescriptionaddvaccination.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionaddvaccinationComponent implements OnInit {
  filterForm: any = FormGroup;
  vaccinationForm: any = FormGroup;
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

    this.vaccinationForm = this.fb.group({
      dosage: ["", [Validators.required]],
      comment: [""],
    });
  }

  ngOnInit(): void {}

  handleAddVaccination() {
    this.isSubmitted = true;
    if (this.vaccinationForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    console.log("VACCINATION DATA==>", this.vaccinationForm.value);
    // routerLink="/individual-doctor/eprescription/eprescriptionvaccination"
  }

  get formValidation() {
    return this.vaccinationForm.controls;
  }

  get registerFormControl() {
    return this.vaccinationForm.controls;
  }
}
