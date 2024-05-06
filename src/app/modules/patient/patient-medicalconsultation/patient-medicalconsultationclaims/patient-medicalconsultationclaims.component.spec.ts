import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalconsultationclaimsComponent } from './patient-medicalconsultationclaims.component';

describe('PatientMedicalconsultationclaimsComponent', () => {
  let component: PatientMedicalconsultationclaimsComponent;
  let fixture: ComponentFixture<PatientMedicalconsultationclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicalconsultationclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalconsultationclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
