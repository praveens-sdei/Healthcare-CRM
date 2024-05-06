import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureAppointmentFourportalComponent } from './esignature-appointment-fourportal.component';

describe('EsignatureAppointmentFourportalComponent', () => {
  let component: EsignatureAppointmentFourportalComponent;
  let fixture: ComponentFixture<EsignatureAppointmentFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureAppointmentFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureAppointmentFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
