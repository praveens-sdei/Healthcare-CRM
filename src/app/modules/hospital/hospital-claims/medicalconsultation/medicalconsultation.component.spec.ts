import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalconsultationComponent } from './medicalconsultation.component';

describe('MedicalconsultationComponent', () => {
  let component: MedicalconsultationComponent;
  let fixture: ComponentFixture<MedicalconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
