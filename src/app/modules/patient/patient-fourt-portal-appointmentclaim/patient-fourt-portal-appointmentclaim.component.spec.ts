import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourtPortalAppointmentclaimComponent } from './patient-fourt-portal-appointmentclaim.component';

describe('PatientFourtPortalAppointmentclaimComponent', () => {
  let component: PatientFourtPortalAppointmentclaimComponent;
  let fixture: ComponentFixture<PatientFourtPortalAppointmentclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourtPortalAppointmentclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourtPortalAppointmentclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
