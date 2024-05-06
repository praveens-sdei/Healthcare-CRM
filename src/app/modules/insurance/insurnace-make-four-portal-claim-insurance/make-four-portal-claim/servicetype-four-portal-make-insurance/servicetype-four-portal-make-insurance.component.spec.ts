import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeFourPortalMakeInsuranceComponent } from './servicetype-four-portal-make-insurance.component';

describe('ServicetypeFourPortalMakeInsuranceComponent', () => {
  let component: ServicetypeFourPortalMakeInsuranceComponent;
  let fixture: ComponentFixture<ServicetypeFourPortalMakeInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeFourPortalMakeInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeFourPortalMakeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
