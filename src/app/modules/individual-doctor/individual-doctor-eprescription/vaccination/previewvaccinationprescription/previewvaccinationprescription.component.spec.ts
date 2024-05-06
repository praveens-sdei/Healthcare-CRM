import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewvaccinationprescriptionComponent } from './previewvaccinationprescription.component';

describe('PreviewvaccinationprescriptionComponent', () => {
  let component: PreviewvaccinationprescriptionComponent;
  let fixture: ComponentFixture<PreviewvaccinationprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewvaccinationprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewvaccinationprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
