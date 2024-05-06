import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVaccinationCardComponent } from './patient-vaccination-card.component';

describe('PatientVaccinationCardComponent', () => {
  let component: PatientVaccinationCardComponent;
  let fixture: ComponentFixture<PatientVaccinationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVaccinationCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVaccinationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
