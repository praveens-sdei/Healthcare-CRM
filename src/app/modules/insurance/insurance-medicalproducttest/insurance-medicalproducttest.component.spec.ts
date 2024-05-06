import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicalproducttestComponent } from './insurance-medicalproducttest.component';

describe('InsuranceMedicalproducttestComponent', () => {
  let component: InsuranceMedicalproducttestComponent;
  let fixture: ComponentFixture<InsuranceMedicalproducttestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicalproducttestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicalproducttestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
