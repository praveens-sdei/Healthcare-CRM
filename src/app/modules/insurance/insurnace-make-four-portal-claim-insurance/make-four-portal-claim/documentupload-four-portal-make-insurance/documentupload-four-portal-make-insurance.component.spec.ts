import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuploadFourPortalMakeInsuranceComponent } from './documentupload-four-portal-make-insurance.component';

describe('DocumentuploadFourPortalMakeInsuranceComponent', () => {
  let component: DocumentuploadFourPortalMakeInsuranceComponent;
  let fixture: ComponentFixture<DocumentuploadFourPortalMakeInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentuploadFourPortalMakeInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuploadFourPortalMakeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
