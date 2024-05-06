import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalAppointmentComponent } from './patient-four-portal-appointment.component';

describe('PatientFourPortalAppointmentComponent', () => {
  let component: PatientFourPortalAppointmentComponent;
  let fixture: ComponentFixture<PatientFourPortalAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
