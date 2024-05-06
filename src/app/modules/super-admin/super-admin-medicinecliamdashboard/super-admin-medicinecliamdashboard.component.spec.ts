import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminMedicinecliamdashboardComponent } from './super-admin-medicinecliamdashboard.component';

describe('SuperAdminMedicinecliamdashboardComponent', () => {
  let component: SuperAdminMedicinecliamdashboardComponent;
  let fixture: ComponentFixture<SuperAdminMedicinecliamdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminMedicinecliamdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminMedicinecliamdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
