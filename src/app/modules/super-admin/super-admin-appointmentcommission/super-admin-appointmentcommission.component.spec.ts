import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminAppointmentcommissionComponent } from './super-admin-appointmentcommission.component';

describe('SuperAdminAppointmentcommissionComponent', () => {
  let component: SuperAdminAppointmentcommissionComponent;
  let fixture: ComponentFixture<SuperAdminAppointmentcommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminAppointmentcommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminAppointmentcommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
