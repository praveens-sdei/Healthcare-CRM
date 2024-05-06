import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceExclusionnameComponent } from './insurance-exclusionname.component';

describe('InsuranceExclusionnameComponent', () => {
  let component: InsuranceExclusionnameComponent;
  let fixture: ComponentFixture<InsuranceExclusionnameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceExclusionnameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceExclusionnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
