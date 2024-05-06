import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationDocumentuploadComponent } from './hospitalization-documentupload.component';

describe('HospitalizationDocumentuploadComponent', () => {
  let component: HospitalizationDocumentuploadComponent;
  let fixture: ComponentFixture<HospitalizationDocumentuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationDocumentuploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationDocumentuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
