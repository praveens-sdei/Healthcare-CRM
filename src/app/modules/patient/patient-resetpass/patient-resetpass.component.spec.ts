import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientResetpassComponent } from './patient-resetpass.component';

describe('PatientResetpassComponent', () => {
  let component: PatientResetpassComponent;
  let fixture: ComponentFixture<PatientResetpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientResetpassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientResetpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
