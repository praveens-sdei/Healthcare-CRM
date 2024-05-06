import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourtPortalAppointmentDetailsComponent } from './patient-fourt-portal-appointment-details.component';

describe('PatientFourtPortalAppointmentDetailsComponent', () => {
  let component: PatientFourtPortalAppointmentDetailsComponent;
  let fixture: ComponentFixture<PatientFourtPortalAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourtPortalAppointmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourtPortalAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
