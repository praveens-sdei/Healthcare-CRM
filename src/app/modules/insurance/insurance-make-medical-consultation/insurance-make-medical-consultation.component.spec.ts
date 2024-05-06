import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMakeMedicalConsultationComponent } from './insurance-make-medical-consultation.component';

describe('InsuranceMakeMedicalConsultationComponent', () => {
  let component: InsuranceMakeMedicalConsultationComponent;
  let fixture: ComponentFixture<InsuranceMakeMedicalConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMakeMedicalConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMakeMedicalConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
