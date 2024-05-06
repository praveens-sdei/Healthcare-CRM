import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadHospitalComponent } from './documentupload-hospital.component';

describe('DocumentuploadHospitalComponent', () => {
  let component: DocumentuploadHospitalComponent;
  let fixture: ComponentFixture<DocumentuploadHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
