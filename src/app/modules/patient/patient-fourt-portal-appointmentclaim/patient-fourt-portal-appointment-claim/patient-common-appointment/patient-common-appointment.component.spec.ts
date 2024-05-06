import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCommonAppointmentComponent } from './patient-common-appointment.component';

describe('PatientCommonAppointmentComponent', () => {
  let component: PatientCommonAppointmentComponent;
  let fixture: ComponentFixture<PatientCommonAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCommonAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCommonAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
