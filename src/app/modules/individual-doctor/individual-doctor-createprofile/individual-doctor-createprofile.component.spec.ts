import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorCreateprofileComponent } from './individual-doctor-createprofile.component';

describe('IndividualDoctorCreateprofileComponent', () => {
  let component: IndividualDoctorCreateprofileComponent;
  let fixture: ComponentFixture<IndividualDoctorCreateprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorCreateprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorCreateprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
