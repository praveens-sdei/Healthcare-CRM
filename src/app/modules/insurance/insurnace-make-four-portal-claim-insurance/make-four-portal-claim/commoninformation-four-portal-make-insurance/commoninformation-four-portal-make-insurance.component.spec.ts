import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationFourPortalMakeInsuranceComponent } from './commoninformation-four-portal-make-insurance.component';

describe('CommoninformationFourPortalMakeInsuranceComponent', () => {
  let component: CommoninformationFourPortalMakeInsuranceComponent;
  let fixture: ComponentFixture<CommoninformationFourPortalMakeInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationFourPortalMakeInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationFourPortalMakeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
