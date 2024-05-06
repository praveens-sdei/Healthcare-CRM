import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewlabprescriptionComponent } from './previewlabprescription.component';

describe('PreviewlabprescriptionComponent', () => {
  let component: PreviewlabprescriptionComponent;
  let fixture: ComponentFixture<PreviewlabprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewlabprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewlabprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
