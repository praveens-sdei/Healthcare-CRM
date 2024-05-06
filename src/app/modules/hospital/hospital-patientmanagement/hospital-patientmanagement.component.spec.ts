import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPatientmanagementComponent } from './hospital-patientmanagement.component';

describe('HospitalPatientmanagementComponent', () => {
  let component: HospitalPatientmanagementComponent;
  let fixture: ComponentFixture<HospitalPatientmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPatientmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPatientmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
