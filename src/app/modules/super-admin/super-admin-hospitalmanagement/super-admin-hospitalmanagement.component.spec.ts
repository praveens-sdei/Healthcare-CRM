import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminHospitalmanagementComponent } from './super-admin-hospitalmanagement.component';

describe('SuperAdminHospitalmanagementComponent', () => {
  let component: SuperAdminHospitalmanagementComponent;
  let fixture: ComponentFixture<SuperAdminHospitalmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminHospitalmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminHospitalmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
