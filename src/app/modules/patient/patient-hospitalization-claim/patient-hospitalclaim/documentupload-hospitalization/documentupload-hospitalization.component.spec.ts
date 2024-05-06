import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadHospitalizationComponent } from './documentupload-hospitalization.component';

describe('DocumentuploadHospitalizationComponent', () => {
  let component: DocumentuploadHospitalizationComponent;
  let fixture: ComponentFixture<DocumentuploadHospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadHospitalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadHospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
