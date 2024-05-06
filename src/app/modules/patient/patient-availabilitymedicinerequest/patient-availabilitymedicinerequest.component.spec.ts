import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAvailabilitymedicinerequestComponent } from './patient-availabilitymedicinerequest.component';

describe('PatientAvailabilitymedicinerequestComponent', () => {
  let component: PatientAvailabilitymedicinerequestComponent;
  let fixture: ComponentFixture<PatientAvailabilitymedicinerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAvailabilitymedicinerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAvailabilitymedicinerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
