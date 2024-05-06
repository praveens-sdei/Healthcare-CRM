import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDocumentuploadAppointmentComponent } from './patient-documentupload-appointment.component';

describe('PatientDocumentuploadAppointmentComponent', () => {
  let component: PatientDocumentuploadAppointmentComponent;
  let fixture: ComponentFixture<PatientDocumentuploadAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientDocumentuploadAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDocumentuploadAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
