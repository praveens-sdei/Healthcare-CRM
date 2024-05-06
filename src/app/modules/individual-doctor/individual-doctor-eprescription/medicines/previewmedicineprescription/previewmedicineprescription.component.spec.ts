import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewmedicineprescriptionComponent } from './previewmedicineprescription.component';

describe('PreviewmedicineprescriptionComponent', () => {
  let component: PreviewmedicineprescriptionComponent;
  let fixture: ComponentFixture<PreviewmedicineprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewmedicineprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewmedicineprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
