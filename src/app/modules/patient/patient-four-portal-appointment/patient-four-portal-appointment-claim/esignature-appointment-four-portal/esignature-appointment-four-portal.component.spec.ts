import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureAppointmentFourPortalComponent } from './esignature-appointment-four-portal.component';

describe('EsignatureAppointmentFourPortalComponent', () => {
  let component: EsignatureAppointmentFourPortalComponent;
  let fixture: ComponentFixture<EsignatureAppointmentFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureAppointmentFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureAppointmentFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
