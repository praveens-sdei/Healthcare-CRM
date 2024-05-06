import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadComponent } from './documentupload.component';

describe('DocumentuploadComponent', () => {
  let component: DocumentuploadComponent;
  let fixture: ComponentFixture<DocumentuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
