import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFourPortalClaimListComponent } from './patient-four-portal-claim-list.component';

describe('PatientFourPortalClaimListComponent', () => {
  let component: PatientFourPortalClaimListComponent;
  let fixture: ComponentFixture<PatientFourPortalClaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFourPortalClaimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFourPortalClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
