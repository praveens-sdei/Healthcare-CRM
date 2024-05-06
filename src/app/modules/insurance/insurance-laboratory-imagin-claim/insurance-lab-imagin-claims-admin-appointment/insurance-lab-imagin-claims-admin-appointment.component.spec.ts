import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLabImaginClaimsAdminAppointmentComponent } from './insurance-lab-imagin-claims-admin-appointment.component';

describe('InsuranceLabImaginClaimsAdminAppointmentComponent', () => {
  let component: InsuranceLabImaginClaimsAdminAppointmentComponent;
  let fixture: ComponentFixture<InsuranceLabImaginClaimsAdminAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLabImaginClaimsAdminAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLabImaginClaimsAdminAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
