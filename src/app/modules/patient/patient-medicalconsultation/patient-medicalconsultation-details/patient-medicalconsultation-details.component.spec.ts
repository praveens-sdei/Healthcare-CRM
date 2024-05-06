import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalconsultationDetailsComponent } from './patient-medicalconsultation-details.component';

describe('PatientMedicalconsultationDetailsComponent', () => {
  let component: PatientMedicalconsultationDetailsComponent;
  let fixture: ComponentFixture<PatientMedicalconsultationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicalconsultationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalconsultationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
