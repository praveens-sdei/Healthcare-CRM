import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHospitalclaimComponent } from './patient-hospitalclaim.component';

describe('PatientHospitalclaimComponent', () => {
  let component: PatientHospitalclaimComponent;
  let fixture: ComponentFixture<PatientHospitalclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientHospitalclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHospitalclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
