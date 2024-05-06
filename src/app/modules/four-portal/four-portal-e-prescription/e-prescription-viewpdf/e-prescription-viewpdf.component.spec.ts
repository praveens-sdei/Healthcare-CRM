import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPrescriptionViewpdfComponent } from './e-prescription-viewpdf.component';

describe('EPrescriptionViewpdfComponent', () => {
  let component: EPrescriptionViewpdfComponent;
  let fixture: ComponentFixture<EPrescriptionViewpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPrescriptionViewpdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPrescriptionViewpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
