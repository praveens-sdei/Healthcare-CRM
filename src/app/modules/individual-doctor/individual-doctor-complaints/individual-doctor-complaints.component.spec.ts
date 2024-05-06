import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorComplaintsComponent } from './individual-doctor-complaints.component';

describe('IndividualDoctorComplaintsComponent', () => {
  let component: IndividualDoctorComplaintsComponent;
  let fixture: ComponentFixture<IndividualDoctorComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorComplaintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
