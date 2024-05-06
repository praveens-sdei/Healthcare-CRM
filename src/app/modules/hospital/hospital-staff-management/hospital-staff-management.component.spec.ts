import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalStaffManagementComponent } from './hospital-staff-management.component';

describe('HospitalStaffManagementComponent', () => {
  let component: HospitalStaffManagementComponent;
  let fixture: ComponentFixture<HospitalStaffManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalStaffManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalStaffManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
