import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEsignatureAppointmentComponent } from './patient-esignature-appointment.component';

describe('PatientEsignatureAppointmentComponent', () => {
  let component: PatientEsignatureAppointmentComponent;
  let fixture: ComponentFixture<PatientEsignatureAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientEsignatureAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEsignatureAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
