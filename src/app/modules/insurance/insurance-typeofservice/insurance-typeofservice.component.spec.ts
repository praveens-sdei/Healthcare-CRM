import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceTypeofserviceComponent } from './insurance-typeofservice.component';

describe('InsuranceTypeofserviceComponent', () => {
  let component: InsuranceTypeofserviceComponent;
  let fixture: ComponentFixture<InsuranceTypeofserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceTypeofserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceTypeofserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
