import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalClaimComponent } from './patient-four-portal-claim.component';

describe('PatientFourPortalClaimComponent', () => {
  let component: PatientFourPortalClaimComponent;
  let fixture: ComponentFixture<PatientFourPortalClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
