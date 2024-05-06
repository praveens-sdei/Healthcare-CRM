import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourtPortalAppointmentClaimComponent } from './patient-fourt-portal-appointment-claim.component';

describe('PatientFourtPortalAppointmentClaimComponent', () => {
  let component: PatientFourtPortalAppointmentClaimComponent;
  let fixture: ComponentFixture<PatientFourtPortalAppointmentClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourtPortalAppointmentClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourtPortalAppointmentClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
