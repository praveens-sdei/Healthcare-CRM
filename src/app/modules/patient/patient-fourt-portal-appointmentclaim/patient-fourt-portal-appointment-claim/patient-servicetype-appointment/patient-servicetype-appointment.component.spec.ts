import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientServicetypeAppointmentComponent } from './patient-servicetype-appointment.component';

describe('PatientServicetypeAppointmentComponent', () => {
  let component: PatientServicetypeAppointmentComponent;
  let fixture: ComponentFixture<PatientServicetypeAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientServicetypeAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientServicetypeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
