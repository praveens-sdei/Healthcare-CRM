import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalconsultationComponent } from './patient-medicalconsultation.component';

describe('PatientMedicalconsultationComponent', () => {
  let component: PatientMedicalconsultationComponent;
  let fixture: ComponentFixture<PatientMedicalconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicalconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
