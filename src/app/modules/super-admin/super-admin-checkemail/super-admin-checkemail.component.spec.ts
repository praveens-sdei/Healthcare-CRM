import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCheckemailComponent } from './super-admin-checkemail.component';

describe('SuperAdminCheckemailComponent', () => {
  let component: SuperAdminCheckemailComponent;
  let fixture: ComponentFixture<SuperAdminCheckemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCheckemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminCheckemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
