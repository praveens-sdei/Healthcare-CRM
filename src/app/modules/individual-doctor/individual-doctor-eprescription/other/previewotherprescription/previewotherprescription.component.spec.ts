import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewotherprescriptionComponent } from './previewotherprescription.component';

describe('PreviewotherprescriptionComponent', () => {
  let component: PreviewotherprescriptionComponent;
  let fixture: ComponentFixture<PreviewotherprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewotherprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewotherprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
