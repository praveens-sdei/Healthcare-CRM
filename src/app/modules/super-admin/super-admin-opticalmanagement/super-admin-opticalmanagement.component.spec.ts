import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminOpticalmanagementComponent } from './super-admin-opticalmanagement.component';

describe('SuperAdminOpticalmanagementComponent', () => {
  let component: SuperAdminOpticalmanagementComponent;
  let fixture: ComponentFixture<SuperAdminOpticalmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminOpticalmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminOpticalmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
