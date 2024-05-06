import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUserinvitationComponent } from './patient-userinvitation.component';

describe('PatientUserinvitationComponent', () => {
  let component: PatientUserinvitationComponent;
  let fixture: ComponentFixture<PatientUserinvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientUserinvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientUserinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
