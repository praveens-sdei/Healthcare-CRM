import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminTotaleclaimsComponent } from './super-admin-totaleclaims.component';

describe('SuperAdminTotaleclaimsComponent', () => {
  let component: SuperAdminTotaleclaimsComponent;
  let fixture: ComponentFixture<SuperAdminTotaleclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminTotaleclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminTotaleclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
