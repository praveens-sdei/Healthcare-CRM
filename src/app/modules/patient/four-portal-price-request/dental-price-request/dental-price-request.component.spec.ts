import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPriceRequestComponent } from './dental-price-request.component';

describe('DentalPriceRequestComponent', () => {
  let component: DentalPriceRequestComponent;
  let fixture: ComponentFixture<DentalPriceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalPriceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
