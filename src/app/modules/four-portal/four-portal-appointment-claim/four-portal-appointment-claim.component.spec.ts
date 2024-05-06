import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalAppointmentClaimComponent } from './four-portal-appointment-claim.component';

describe('FourPortalAppointmentClaimComponent', () => {
  let component: FourPortalAppointmentClaimComponent;
  let fixture: ComponentFixture<FourPortalAppointmentClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalAppointmentClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalAppointmentClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
