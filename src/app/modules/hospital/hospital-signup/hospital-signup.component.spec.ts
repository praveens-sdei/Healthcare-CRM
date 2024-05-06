import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSignupComponent } from './hospital-signup.component';

describe('HospitalSignupComponent', () => {
  let component: HospitalSignupComponent;
  let fixture: ComponentFixture<HospitalSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
