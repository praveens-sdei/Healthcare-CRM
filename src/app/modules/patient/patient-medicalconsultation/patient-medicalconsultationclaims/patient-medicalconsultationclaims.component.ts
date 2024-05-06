import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-patient-medicalconsultationclaims',
  templateUrl: './patient-medicalconsultationclaims.component.html',
  styleUrls: ['./patient-medicalconsultationclaims.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'mainStepper'
})
export class PatientMedicalconsultationclaimsComponent implements OnInit {

  @ViewChild('mainStepperr') mainStepper: MatStepper;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation>;


  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }




  ngOnInit(): void {

    console.log("tkjfkjsdklflsdfsdfsdfsdfs");

    // throw new Error('Method not implemented.');
  }

}
