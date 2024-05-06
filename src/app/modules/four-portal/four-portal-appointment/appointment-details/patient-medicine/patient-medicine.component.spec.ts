import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicineComponent } from './patient-medicine.component';

describe('PatientMedicineComponent', () => {
  let component: PatientMedicineComponent;
  let fixture: ComponentFixture<PatientMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
