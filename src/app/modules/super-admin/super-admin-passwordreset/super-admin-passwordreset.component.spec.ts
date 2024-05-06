import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPasswordresetComponent } from './super-admin-passwordreset.component';

describe('SuperAdminPasswordresetComponent', () => {
  let component: SuperAdminPasswordresetComponent;
  let fixture: ComponentFixture<SuperAdminPasswordresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminPasswordresetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
