import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminManualmedicineclaimdashboardComponent } from './super-admin-manualmedicineclaimdashboard.component';

describe('SuperAdminManualmedicineclaimdashboardComponent', () => {
  let component: SuperAdminManualmedicineclaimdashboardComponent;
  let fixture: ComponentFixture<SuperAdminManualmedicineclaimdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminManualmedicineclaimdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminManualmedicineclaimdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
