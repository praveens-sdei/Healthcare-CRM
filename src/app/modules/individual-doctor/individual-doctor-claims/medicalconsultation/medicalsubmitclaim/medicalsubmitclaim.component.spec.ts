import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalsubmitclaimComponent } from './medicalsubmitclaim.component';

describe('MedicalsubmitclaimComponent', () => {
  let component: MedicalsubmitclaimComponent;
  let fixture: ComponentFixture<MedicalsubmitclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalsubmitclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalsubmitclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
