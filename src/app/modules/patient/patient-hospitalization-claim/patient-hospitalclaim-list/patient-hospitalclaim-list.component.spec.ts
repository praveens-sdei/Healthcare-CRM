import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHospitalclaimListComponent } from './patient-hospitalclaim-list.component';

describe('PatientHospitalclaimListComponent', () => {
  let component: PatientHospitalclaimListComponent;
  let fixture: ComponentFixture<PatientHospitalclaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientHospitalclaimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHospitalclaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
