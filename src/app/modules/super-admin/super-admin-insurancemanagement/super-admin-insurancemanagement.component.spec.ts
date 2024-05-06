import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminInsurancemanagementComponent } from './super-admin-insurancemanagement.component';

describe('SuperAdminInsurancemanagementComponent', () => {
  let component: SuperAdminInsurancemanagementComponent;
  let fixture: ComponentFixture<SuperAdminInsurancemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminInsurancemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminInsurancemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
