import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProfilemanagementComponent } from './insurance-profilemanagement.component';

describe('InsuranceProfilemanagementComponent', () => {
  let component: InsuranceProfilemanagementComponent;
  let fixture: ComponentFixture<InsuranceProfilemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceProfilemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceProfilemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
