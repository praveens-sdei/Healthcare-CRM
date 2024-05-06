import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadFourPortalComponent } from './documentupload-four-portal.component';

describe('DocumentuploadFourPortalComponent', () => {
  let component: DocumentuploadFourPortalComponent;
  let fixture: ComponentFixture<DocumentuploadFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
