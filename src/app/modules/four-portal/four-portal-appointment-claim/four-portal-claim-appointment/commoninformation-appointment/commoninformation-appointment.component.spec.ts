import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationAppointmentComponent } from './commoninformation-appointment.component';

describe('CommoninformationAppointmentComponent', () => {
  let component: CommoninformationAppointmentComponent;
  let fixture: ComponentFixture<CommoninformationAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
