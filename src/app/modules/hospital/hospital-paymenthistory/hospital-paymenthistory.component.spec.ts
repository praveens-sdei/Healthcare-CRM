import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPaymenthistoryComponent } from './hospital-paymenthistory.component';

describe('HospitalPaymenthistoryComponent', () => {
  let component: HospitalPaymenthistoryComponent;
  let fixture: ComponentFixture<HospitalPaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPaymenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
