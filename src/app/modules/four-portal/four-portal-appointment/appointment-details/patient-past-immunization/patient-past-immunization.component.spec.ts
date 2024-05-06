import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPastImmunizationComponent } from './patient-past-immunization.component';

describe('PatientPastImmunizationComponent', () => {
  let component: PatientPastImmunizationComponent;
  let fixture: ComponentFixture<PatientPastImmunizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPastImmunizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPastImmunizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
