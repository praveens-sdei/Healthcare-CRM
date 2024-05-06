import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPrescriptionPreviewComponent } from './e-prescription-preview.component';

describe('EPrescriptionPreviewComponent', () => {
  let component: EPrescriptionPreviewComponent;
  let fixture: ComponentFixture<EPrescriptionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPrescriptionPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPrescriptionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
