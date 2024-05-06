import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalAppointmentListComponent } from './patient-four-portal-appointment-list.component';

describe('PatientFourPortalAppointmentListComponent', () => {
  let component: PatientFourPortalAppointmentListComponent;
  let fixture: ComponentFixture<PatientFourPortalAppointmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalAppointmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
