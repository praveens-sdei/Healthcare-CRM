import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorMedicalproductstestsComponent } from './individual-doctor-medicalproductstests.component';

describe('IndividualDoctorMedicalproductstestsComponent', () => {
  let component: IndividualDoctorMedicalproductstestsComponent;
  let fixture: ComponentFixture<IndividualDoctorMedicalproductstestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorMedicalproductstestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorMedicalproductstestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
