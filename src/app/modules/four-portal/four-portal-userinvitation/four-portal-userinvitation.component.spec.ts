import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalUserinvitationComponent } from './four-portal-userinvitation.component';

describe('FourPortalUserinvitationComponent', () => {
  let component: FourPortalUserinvitationComponent;
  let fixture: ComponentFixture<FourPortalUserinvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalUserinvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalUserinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
