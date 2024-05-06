import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePaymenthistoryComponent } from './insurance-paymenthistory.component';

describe('InsurancePaymenthistoryComponent', () => {
  let component: InsurancePaymenthistoryComponent;
  let fixture: ComponentFixture<InsurancePaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePaymenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
