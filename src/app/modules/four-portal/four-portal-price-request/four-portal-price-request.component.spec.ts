import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalPriceRequestComponent } from './four-portal-price-request.component';

describe('FourPortalPriceRequestComponent', () => {
  let component: FourPortalPriceRequestComponent;
  let fixture: ComponentFixture<FourPortalPriceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalPriceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
