import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeAppointmentFourportalComponent } from './servicetype-appointment-fourportal.component';

describe('ServicetypeAppointmentFourportalComponent', () => {
  let component: ServicetypeAppointmentFourportalComponent;
  let fixture: ComponentFixture<ServicetypeAppointmentFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeAppointmentFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeAppointmentFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
