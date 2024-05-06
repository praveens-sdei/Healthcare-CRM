import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorPreauthhospitalizationComponent } from './individual-doctor-preauthhospitalization.component';

describe('IndividualDoctorPreauthhospitalizationComponent', () => {
  let component: IndividualDoctorPreauthhospitalizationComponent;
  let fixture: ComponentFixture<IndividualDoctorPreauthhospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorPreauthhospitalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorPreauthhospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
