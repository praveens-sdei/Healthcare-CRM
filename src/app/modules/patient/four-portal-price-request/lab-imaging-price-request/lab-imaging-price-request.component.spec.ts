import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabImagingPriceRequestComponent } from './lab-imaging-price-request.component';

describe('LabImagingPriceRequestComponent', () => {
  let component: LabImagingPriceRequestComponent;
  let fixture: ComponentFixture<LabImagingPriceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabImagingPriceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabImagingPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
