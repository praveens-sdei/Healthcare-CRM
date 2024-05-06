import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminDashboardclaimComponent } from './super-admin-dashboardclaim.component';

describe('SuperAdminDashboardclaimComponent', () => {
  let component: SuperAdminDashboardclaimComponent;
  let fixture: ComponentFixture<SuperAdminDashboardclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminDashboardclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminDashboardclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
