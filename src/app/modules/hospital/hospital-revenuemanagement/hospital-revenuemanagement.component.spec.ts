import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalRevenuemanagementComponent } from './hospital-revenuemanagement.component';

describe('HospitalRevenuemanagementComponent', () => {
  let component: HospitalRevenuemanagementComponent;
  let fixture: ComponentFixture<HospitalRevenuemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalRevenuemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRevenuemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
