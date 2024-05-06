import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHospitalizationdetailComponent } from './insurance-hospitalizationdetail.component';

describe('InsuranceHospitalizationdetailComponent', () => {
  let component: InsuranceHospitalizationdetailComponent;
  let fixture: ComponentFixture<InsuranceHospitalizationdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceHospitalizationdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceHospitalizationdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
