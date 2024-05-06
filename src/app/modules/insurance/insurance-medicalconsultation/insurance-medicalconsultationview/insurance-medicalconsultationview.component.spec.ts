import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicalconsultationviewComponent } from './insurance-medicalconsultationview.component';

describe('InsuranceMedicalconsultationviewComponent', () => {
  let component: InsuranceMedicalconsultationviewComponent;
  let fixture: ComponentFixture<InsuranceMedicalconsultationviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicalconsultationviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicalconsultationviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
