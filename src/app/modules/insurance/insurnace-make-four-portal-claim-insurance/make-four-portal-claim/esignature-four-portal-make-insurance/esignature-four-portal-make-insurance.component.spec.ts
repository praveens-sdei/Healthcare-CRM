import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureFourPortalMakeInsuranceComponent } from './esignature-four-portal-make-insurance.component';

describe('EsignatureFourPortalMakeInsuranceComponent', () => {
  let component: EsignatureFourPortalMakeInsuranceComponent;
  let fixture: ComponentFixture<EsignatureFourPortalMakeInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureFourPortalMakeInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureFourPortalMakeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
