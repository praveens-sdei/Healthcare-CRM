import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyRevenuemanagementComponent } from './pharmacy-revenuemanagement.component';

describe('PharmacyRevenuemanagementComponent', () => {
  let component: PharmacyRevenuemanagementComponent;
  let fixture: ComponentFixture<PharmacyRevenuemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyRevenuemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyRevenuemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
