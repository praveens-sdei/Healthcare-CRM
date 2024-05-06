import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalconsultationlistComponent } from './patient-medicalconsultationlist.component';

describe('PatientMedicalconsultationlistComponent', () => {
  let component: PatientMedicalconsultationlistComponent;
  let fixture: ComponentFixture<PatientMedicalconsultationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicalconsultationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalconsultationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
