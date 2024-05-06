import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceCompleteComponent } from './price-complete.component';

describe('PriceCompleteComponent', () => {
  let component: PriceCompleteComponent;
  let fixture: ComponentFixture<PriceCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
