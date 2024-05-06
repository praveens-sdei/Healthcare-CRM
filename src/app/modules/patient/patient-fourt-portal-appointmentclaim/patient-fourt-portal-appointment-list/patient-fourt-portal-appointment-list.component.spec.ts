import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourtPortalAppointmentListComponent } from './patient-fourt-portal-appointment-list.component';

describe('PatientFourtPortalAppointmentListComponent', () => {
  let component: PatientFourtPortalAppointmentListComponent;
  let fixture: ComponentFixture<PatientFourtPortalAppointmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourtPortalAppointmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourtPortalAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
