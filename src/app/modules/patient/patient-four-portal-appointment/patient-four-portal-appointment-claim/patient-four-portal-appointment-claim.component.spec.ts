import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalAppointmentClaimComponent } from './patient-four-portal-appointment-claim.component';

describe('PatientFourPortalAppointmentClaimComponent', () => {
  let component: PatientFourPortalAppointmentClaimComponent;
  let fixture: ComponentFixture<PatientFourPortalAppointmentClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalAppointmentClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalAppointmentClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
