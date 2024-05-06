import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientComplaintComponent } from './patient-complaint.component';

describe('PatientComplaintComponent', () => {
  let component: PatientComplaintComponent;
  let fixture: ComponentFixture<PatientComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
