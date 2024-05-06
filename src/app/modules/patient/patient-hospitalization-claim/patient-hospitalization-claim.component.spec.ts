import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHospitalizationClaimComponent } from './patient-hospitalization-claim.component';

describe('PatientHospitalizationClaimComponent', () => {
  let component: PatientHospitalizationClaimComponent;
  let fixture: ComponentFixture<PatientHospitalizationClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientHospitalizationClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHospitalizationClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
