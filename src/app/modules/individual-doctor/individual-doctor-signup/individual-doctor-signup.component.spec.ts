import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorSignupComponent } from './individual-doctor-signup.component';

describe('IndividualDoctorSignupComponent', () => {
  let component: IndividualDoctorSignupComponent;
  let fixture: ComponentFixture<IndividualDoctorSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
