import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalDocumentComponent } from './patient-medical-document.component';

describe('PatientMedicalDocumentComponent', () => {
  let component: PatientMedicalDocumentComponent;
  let fixture: ComponentFixture<PatientMedicalDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicalDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
