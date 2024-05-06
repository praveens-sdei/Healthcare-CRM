import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminDentalmanagementComponent } from './super-admin-dentalmanagement.component';

describe('SuperAdminDentalmanagementComponent', () => {
  let component: SuperAdminDentalmanagementComponent;
  let fixture: ComponentFixture<SuperAdminDentalmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminDentalmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminDentalmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
