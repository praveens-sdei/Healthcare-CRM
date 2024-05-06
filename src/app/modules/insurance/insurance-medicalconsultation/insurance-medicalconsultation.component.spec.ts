import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicalconsultationComponent } from './insurance-medicalconsultation.component';

describe('InsuranceMedicalconsultationComponent', () => {
  let component: InsuranceMedicalconsultationComponent;
  let fixture: ComponentFixture<InsuranceMedicalconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicalconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicalconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
