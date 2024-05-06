import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-pharmacy-medicinclaims-preauthorization',
  templateUrl: './pharmacy-medicinclaims-preauthorization.component.html',
  styleUrls: ['./pharmacy-medicinclaims-preauthorization.component.scss'],
  encapsulation:ViewEncapsulation.None,
  exportAs:'mainStepper'
})
export class PharmacyMedicinclaimsPreauthorizationComponent implements OnInit {

  @ViewChild('mainStepper') mainStepper: MatStepper;
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
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  

  
    ngOnInit(): void {
      // throw new Error('Method not implemented.');
    }

}
