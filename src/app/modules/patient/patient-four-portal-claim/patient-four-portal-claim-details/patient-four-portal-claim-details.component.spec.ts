import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalClaimDetailsComponent } from './patient-four-portal-claim-details.component';

describe('PatientFourPortalClaimDetailsComponent', () => {
  let component: PatientFourPortalClaimDetailsComponent;
  let fixture: ComponentFixture<PatientFourPortalClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalClaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
