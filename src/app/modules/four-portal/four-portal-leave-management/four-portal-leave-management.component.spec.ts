import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalLeaveManagementComponent } from './four-portal-leave-management.component';

describe('FourPortalLeaveManagementComponent', () => {
  let component: FourPortalLeaveManagementComponent;
  let fixture: ComponentFixture<FourPortalLeaveManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalLeaveManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalLeaveManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
