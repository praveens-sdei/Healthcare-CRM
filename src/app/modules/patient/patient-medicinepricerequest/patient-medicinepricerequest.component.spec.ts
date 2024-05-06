import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicinepricerequestComponent } from './patient-medicinepricerequest.component';

describe('PatientMedicinepricerequestComponent', () => {
  let component: PatientMedicinepricerequestComponent;
  let fixture: ComponentFixture<PatientMedicinepricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicinepricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicinepricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
