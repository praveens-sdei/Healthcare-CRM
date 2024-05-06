import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminComplaintmanagementComponent } from './super-admin-complaintmanagement.component';

describe('SuperAdminComplaintmanagementComponent', () => {
  let component: SuperAdminComplaintmanagementComponent;
  let fixture: ComponentFixture<SuperAdminComplaintmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminComplaintmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminComplaintmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
