import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminUserinvitationComponent } from './super-admin-userinvitation.component';

describe('SuperAdminUserinvitationComponent', () => {
  let component: SuperAdminUserinvitationComponent;
  let fixture: ComponentFixture<SuperAdminUserinvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminUserinvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminUserinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
