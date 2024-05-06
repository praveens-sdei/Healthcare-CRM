import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceMakeFourPortalClaimInsuranceComponent } from './insurnace-make-four-portal-claim-insurance.component';

describe('InsurnaceMakeFourPortalClaimInsuranceComponent', () => {
  let component: InsurnaceMakeFourPortalClaimInsuranceComponent;
  let fixture: ComponentFixture<InsurnaceMakeFourPortalClaimInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceMakeFourPortalClaimInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceMakeFourPortalClaimInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
