import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadAppointmentFourportalComponent } from './documentupload-appointment-fourportal.component';

describe('DocumentuploadAppointmentFourportalComponent', () => {
  let component: DocumentuploadAppointmentFourportalComponent;
  let fixture: ComponentFixture<DocumentuploadAppointmentFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadAppointmentFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadAppointmentFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
