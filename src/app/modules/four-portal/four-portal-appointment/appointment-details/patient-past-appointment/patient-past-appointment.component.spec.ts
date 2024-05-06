import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPastAppointmentComponent } from './patient-past-appointment.component';

describe('PatientPastAppointmentComponent', () => {
  let component: PatientPastAppointmentComponent;
  let fixture: ComponentFixture<PatientPastAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPastAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPastAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
