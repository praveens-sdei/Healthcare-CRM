import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHospitalclaimDetailsComponent } from './patient-hospitalclaim-details.component';

describe('PatientHospitalclaimDetailsComponent', () => {
  let component: PatientHospitalclaimDetailsComponent;
  let fixture: ComponentFixture<PatientHospitalclaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientHospitalclaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHospitalclaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
