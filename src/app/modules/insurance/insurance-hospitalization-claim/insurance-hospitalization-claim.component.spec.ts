import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHospitalizationClaimComponent } from './insurance-hospitalization-claim.component';

describe('InsuranceHospitalizationClaimComponent', () => {
  let component: InsuranceHospitalizationClaimComponent;
  let fixture: ComponentFixture<InsuranceHospitalizationClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceHospitalizationClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceHospitalizationClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
