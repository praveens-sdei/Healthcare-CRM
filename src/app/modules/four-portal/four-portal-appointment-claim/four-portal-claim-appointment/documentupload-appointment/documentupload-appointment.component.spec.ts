import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadAppointmentComponent } from './documentupload-appointment.component';

describe('DocumentuploadAppointmentComponent', () => {
  let component: DocumentuploadAppointmentComponent;
  let fixture: ComponentFixture<DocumentuploadAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
