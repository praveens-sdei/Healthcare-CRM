import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalPaymenthistoryComponent } from './four-portal-paymenthistory.component';

describe('FourPortalPaymenthistoryComponent', () => {
  let component: FourPortalPaymenthistoryComponent;
  let fixture: ComponentFixture<FourPortalPaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalPaymenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalPaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
