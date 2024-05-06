import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatevaccinationprescriptionComponent } from './validatevaccinationprescription.component';

describe('ValidatevaccinationprescriptionComponent', () => {
  let component: ValidatevaccinationprescriptionComponent;
  let fixture: ComponentFixture<ValidatevaccinationprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatevaccinationprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatevaccinationprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
