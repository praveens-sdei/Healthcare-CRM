import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeAppointmentComponent } from './servicetype-appointment.component';

describe('ServicetypeAppointmentComponent', () => {
  let component: ServicetypeAppointmentComponent;
  let fixture: ComponentFixture<ServicetypeAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
