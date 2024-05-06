import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHospitalizationClaimViewComponent } from './insurance-hospitalization-claim-view.component';

describe('InsuranceHospitalizationClaimViewComponent', () => {
  let component: InsuranceHospitalizationClaimViewComponent;
  let fixture: ComponentFixture<InsuranceHospitalizationClaimViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceHospitalizationClaimViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceHospitalizationClaimViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
