import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminOpeninghourmanagementComponent } from './super-admin-openinghourmanagement.component';

describe('SuperAdminOpeninghourmanagementComponent', () => {
  let component: SuperAdminOpeninghourmanagementComponent;
  let fixture: ComponentFixture<SuperAdminOpeninghourmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminOpeninghourmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminOpeninghourmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
