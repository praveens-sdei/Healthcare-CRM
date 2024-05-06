import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadConsultationComponent } from './documentupload-consultation.component';

describe('DocumentuploadConsultationComponent', () => {
  let component: DocumentuploadConsultationComponent;
  let fixture: ComponentFixture<DocumentuploadConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
