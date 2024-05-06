import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadPreauthComponent } from './documentupload-preauth.component';

describe('DocumentuploadPreauthComponent', () => {
  let component: DocumentuploadPreauthComponent;
  let fixture: ComponentFixture<DocumentuploadPreauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadPreauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadPreauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
