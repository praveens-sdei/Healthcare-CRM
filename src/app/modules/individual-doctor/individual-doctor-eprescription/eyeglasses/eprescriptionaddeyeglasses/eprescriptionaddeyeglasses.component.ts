import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-eprescriptionaddeyeglasses",
  templateUrl: "./eprescriptionaddeyeglasses.component.html",
  styleUrls: ["./eprescriptionaddeyeglasses.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionaddeyeglassesComponent implements OnInit {
  filterForm: any = FormGroup;
  eyeGlassForm: any = FormGroup;
  isSubmitted: boolean = false;
  @ViewChild("addeyeglasstest") addeyeglasstest: ElementRef;

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

    this.eyeGlassForm = this.fb.group({
      left_eye: this.fb.group({
        sphere: ["", [Validators.required]],
        cylinder: ["", [Validators.required]],
        axis: ["", [Validators.required]],
        addition: ["", [Validators.required]],
      }),
      right_eye: this.fb.group({
        sphere: ["", [Validators.required]],
        cylinder: ["", [Validators.required]],
        axis: ["", [Validators.required]],
        addition: ["", [Validators.required]],
      }),
      treatment: ["", [Validators.required]],
      comment: [""],
    });
  }

  ngOnInit(): void {}

  handleAddEyeGalss() {
    this.isSubmitted = true;
    if (this.eyeGlassForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    console.log("AYE GLASS DATA====>", this.eyeGlassForm.value);
    // routerLink="/individual-doctor/eprescription/eprescriptioneyeglasses"
  }

  get registerFormControl() {
    return this.eyeGlassForm.controls;
  }

  get f1() {
    return this.eyeGlassForm.controls.left_eye as FormGroup;
  }

  get f2() {
    return this.eyeGlassForm.controls.right_eye as FormGroup;
  }

  abc(){
    this.openVerticallyCenteredrabeprazole(this.addeyeglasstest)
  }

    // add vaccination test
    openVerticallyCenteredrabeprazole(addeyeglasstest: any) {
      this.modalService.open(addeyeglasstest, {
        centered: true,
        size: "lg",
        windowClass: "rabeprazole",
      });
    }
}
