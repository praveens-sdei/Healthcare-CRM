import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicalconsultationClaimComponent } from './insurance-medicalconsultation-claim.component';

describe('InsuranceMedicalconsultationClaimComponent', () => {
  let component: InsuranceMedicalconsultationClaimComponent;
  let fixture: ComponentFixture<InsuranceMedicalconsultationClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicalconsultationClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicalconsultationClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
