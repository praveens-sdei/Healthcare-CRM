import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationAppointmentFourPortalComponent } from './commoninformation-appointment-four-portal.component';

describe('CommoninformationAppointmentFourPortalComponent', () => {
  let component: CommoninformationAppointmentFourPortalComponent;
  let fixture: ComponentFixture<CommoninformationAppointmentFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationAppointmentFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationAppointmentFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
