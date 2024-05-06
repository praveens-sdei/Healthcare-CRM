import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicalconsultationdetailsComponent } from './insurance-medicalconsultationdetails.component';

describe('InsuranceMedicalconsultationdetailsComponent', () => {
  let component: InsuranceMedicalconsultationdetailsComponent;
  let fixture: ComponentFixture<InsuranceMedicalconsultationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicalconsultationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicalconsultationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
