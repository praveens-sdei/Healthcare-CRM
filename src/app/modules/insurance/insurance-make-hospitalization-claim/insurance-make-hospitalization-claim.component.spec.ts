import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMakeHospitalizationClaimComponent } from './insurance-make-hospitalization-claim.component';

describe('InsuranceMakeHospitalizationClaimComponent', () => {
  let component: InsuranceMakeHospitalizationClaimComponent;
  let fixture: ComponentFixture<InsuranceMakeHospitalizationClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMakeHospitalizationClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMakeHospitalizationClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
