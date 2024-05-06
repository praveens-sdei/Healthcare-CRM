import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewimagingprescriptionComponent } from './previewimagingprescription.component';

describe('PreviewimagingprescriptionComponent', () => {
  let component: PreviewimagingprescriptionComponent;
  let fixture: ComponentFixture<PreviewimagingprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewimagingprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewimagingprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
