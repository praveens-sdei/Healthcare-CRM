import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalRevenuemanagementComponent } from './four-portal-revenuemanagement.component';

describe('FourPortalRevenuemanagementComponent', () => {
  let component: FourPortalRevenuemanagementComponent;
  let fixture: ComponentFixture<FourPortalRevenuemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalRevenuemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalRevenuemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
