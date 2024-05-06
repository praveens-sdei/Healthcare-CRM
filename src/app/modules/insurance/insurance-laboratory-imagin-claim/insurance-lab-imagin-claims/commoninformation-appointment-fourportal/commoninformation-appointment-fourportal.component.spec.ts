import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationAppointmentFourportalComponent } from './commoninformation-appointment-fourportal.component';

describe('CommoninformationAppointmentFourportalComponent', () => {
  let component: CommoninformationAppointmentFourportalComponent;
  let fixture: ComponentFixture<CommoninformationAppointmentFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationAppointmentFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationAppointmentFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
