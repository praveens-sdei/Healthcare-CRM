import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadAppointmentFourPortalComponent } from './documentupload-appointment-four-portal.component';

describe('DocumentuploadAppointmentFourPortalComponent', () => {
  let component: DocumentuploadAppointmentFourPortalComponent;
  let fixture: ComponentFixture<DocumentuploadAppointmentFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadAppointmentFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadAppointmentFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
