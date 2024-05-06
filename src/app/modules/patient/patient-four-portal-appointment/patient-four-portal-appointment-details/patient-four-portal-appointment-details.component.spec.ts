import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalAppointmentDetailsComponent } from './patient-four-portal-appointment-details.component';

describe('PatientFourPortalAppointmentDetailsComponent', () => {
  let component: PatientFourPortalAppointmentDetailsComponent;
  let fixture: ComponentFixture<PatientFourPortalAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalAppointmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
