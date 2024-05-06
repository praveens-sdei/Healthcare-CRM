import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalUserinvitationComponent } from './hospital-userinvitation.component';

describe('HospitalUserinvitationComponent', () => {
  let component: HospitalUserinvitationComponent;
  let fixture: ComponentFixture<HospitalUserinvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalUserinvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalUserinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
