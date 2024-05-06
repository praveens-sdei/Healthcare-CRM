import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourportalClaimComponent } from './patient-fourportal-claim.component';

describe('PatientFourportalClaimComponent', () => {
  let component: PatientFourportalClaimComponent;
  let fixture: ComponentFixture<PatientFourportalClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourportalClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourportalClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
