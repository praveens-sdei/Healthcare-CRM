import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalForgotpassComponent } from './hospital-forgotpass.component';

describe('HospitalForgotpassComponent', () => {
  let component: HospitalForgotpassComponent;
  let fixture: ComponentFixture<HospitalForgotpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalForgotpassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalForgotpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
