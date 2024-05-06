import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: "app-eprescriptionaddother",
  templateUrl: "./eprescriptionaddother.component.html",
  styleUrls: ["./eprescriptionaddother.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionaddotherComponent implements OnInit {
  filterForm: any = FormGroup;
  paraclinicalForm: any = FormGroup;

  isSubmitted: boolean = false;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router
  ) {
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

    this.paraclinicalForm = this.fb.group({
      reason_for_paraclinical: ["", [Validators.required]],
      relevant_information: [""],
      specific_instruction: [""],
      additional_comments: [""],
    });
  }

  ngOnInit(): void {}

  showForm() {
    console.log(this.filterForm.value);
  }

  handleAddParaclinical() {
    this.isSubmitted = true;
    if (this.paraclinicalForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    console.log(this.paraclinicalForm.value);

    // this.router.navigate([
    //   "individual-doctor/eprescription/eprescriptionother",
    // ]);
  }

  get f() {
    return this.paraclinicalForm.controls;
  }
}
