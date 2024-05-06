import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceStaffmanagementComponent } from './insurance-staffmanagement.component';

describe('InsuranceStaffmanagementComponent', () => {
  let component: InsuranceStaffmanagementComponent;
  let fixture: ComponentFixture<InsuranceStaffmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceStaffmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceStaffmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
