import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticalPriceRequestComponent } from './optical-price-request.component';

describe('OpticalPriceRequestComponent', () => {
  let component: OpticalPriceRequestComponent;
  let fixture: ComponentFixture<OpticalPriceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpticalPriceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticalPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
