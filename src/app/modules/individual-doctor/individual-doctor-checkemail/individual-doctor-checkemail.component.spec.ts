import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorCheckemailComponent } from './individual-doctor-checkemail.component';

describe('IndividualDoctorCheckemailComponent', () => {
  let component: IndividualDoctorCheckemailComponent;
  let fixture: ComponentFixture<IndividualDoctorCheckemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorCheckemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorCheckemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
