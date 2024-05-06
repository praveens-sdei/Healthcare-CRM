import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceAppointmentViewAllclaimComponent } from './insurance-appointment-view-allclaim.component';

describe('InsuranceAppointmentViewAllclaimComponent', () => {
  let component: InsuranceAppointmentViewAllclaimComponent;
  let fixture: ComponentFixture<InsuranceAppointmentViewAllclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceAppointmentViewAllclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceAppointmentViewAllclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
