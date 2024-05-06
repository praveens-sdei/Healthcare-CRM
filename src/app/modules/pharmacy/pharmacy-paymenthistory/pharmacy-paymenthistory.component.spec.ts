import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyPaymenthistoryComponent } from './pharmacy-paymenthistory.component';

describe('PharmacyPaymenthistoryComponent', () => {
  let component: PharmacyPaymenthistoryComponent;
  let fixture: ComponentFixture<PharmacyPaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyPaymenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyPaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
