import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevieweyeglassesprescriptionComponent } from './previeweyeglassesprescription.component';

describe('PrevieweyeglassesprescriptionComponent', () => {
  let component: PrevieweyeglassesprescriptionComponent;
  let fixture: ComponentFixture<PrevieweyeglassesprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevieweyeglassesprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevieweyeglassesprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
