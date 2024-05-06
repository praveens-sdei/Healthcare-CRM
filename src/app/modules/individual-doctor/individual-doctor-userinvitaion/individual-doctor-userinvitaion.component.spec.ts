import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorUserinvitaionComponent } from './individual-doctor-userinvitaion.component';

describe('IndividualDoctorUserinvitaionComponent', () => {
  let component: IndividualDoctorUserinvitaionComponent;
  let fixture: ComponentFixture<IndividualDoctorUserinvitaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorUserinvitaionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorUserinvitaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
