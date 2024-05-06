import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorPaymenthistoryComponent } from './individual-doctor-paymenthistory.component';

describe('IndividualDoctorPaymenthistoryComponent', () => {
  let component: IndividualDoctorPaymenthistoryComponent;
  let fixture: ComponentFixture<IndividualDoctorPaymenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorPaymenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorPaymenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
