import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalMedicalproductTestComponent } from './hospital-medicalproduct-test.component';

describe('HospitalMedicalproductTestComponent', () => {
  let component: HospitalMedicalproductTestComponent;
  let fixture: ComponentFixture<HospitalMedicalproductTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalMedicalproductTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalMedicalproductTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
