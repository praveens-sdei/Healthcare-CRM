import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalClaimAppointmentComponent } from './four-portal-claim-appointment.component';

describe('FourPortalClaimAppointmentComponent', () => {
  let component: FourPortalClaimAppointmentComponent;
  let fixture: ComponentFixture<FourPortalClaimAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalClaimAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalClaimAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
