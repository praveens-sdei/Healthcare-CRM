import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicineclaimsComponent } from './patient-medicineclaims.component';

describe('PatientMedicineclaimsComponent', () => {
  let component: PatientMedicineclaimsComponent;
  let fixture: ComponentFixture<PatientMedicineclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicineclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicineclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
