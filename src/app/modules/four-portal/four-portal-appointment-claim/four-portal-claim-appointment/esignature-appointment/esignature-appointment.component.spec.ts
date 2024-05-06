import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureAppointmentComponent } from './esignature-appointment.component';

describe('EsignatureAppointmentComponent', () => {
  let component: EsignatureAppointmentComponent;
  let fixture: ComponentFixture<EsignatureAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
