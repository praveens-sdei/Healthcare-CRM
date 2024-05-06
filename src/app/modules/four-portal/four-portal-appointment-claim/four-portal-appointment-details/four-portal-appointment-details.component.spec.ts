import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalAppointmentDetailsComponent } from './four-portal-appointment-details.component';

describe('FourPortalAppointmentDetailsComponent', () => {
  let component: FourPortalAppointmentDetailsComponent;
  let fixture: ComponentFixture<FourPortalAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalAppointmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
