import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHospitalizatioclaimComponent } from './insurance-hospitalizatioclaim.component';

describe('InsuranceHospitalizatioclaimComponent', () => {
  let component: InsuranceHospitalizatioclaimComponent;
  let fixture: ComponentFixture<InsuranceHospitalizatioclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceHospitalizatioclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceHospitalizatioclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
