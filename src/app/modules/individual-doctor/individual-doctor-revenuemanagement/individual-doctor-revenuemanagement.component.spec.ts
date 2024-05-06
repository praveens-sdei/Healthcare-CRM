import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorRevenuemanagementComponent } from './individual-doctor-revenuemanagement.component';

describe('IndividualDoctorRevenuemanagementComponent', () => {
  let component: IndividualDoctorRevenuemanagementComponent;
  let fixture: ComponentFixture<IndividualDoctorRevenuemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorRevenuemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorRevenuemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
