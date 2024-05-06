import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDetailsAppointmentClaimComponent } from './insurance-details-appointment-claim.component';

describe('InsuranceDetailsAppointmentClaimComponent', () => {
  let component: InsuranceDetailsAppointmentClaimComponent;
  let fixture: ComponentFixture<InsuranceDetailsAppointmentClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDetailsAppointmentClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailsAppointmentClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
