import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeAppointmentFourPortalComponent } from './servicetype-appointment-four-portal.component';

describe('ServicetypeAppointmentFourPortalComponent', () => {
  let component: ServicetypeAppointmentFourPortalComponent;
  let fixture: ComponentFixture<ServicetypeAppointmentFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeAppointmentFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeAppointmentFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
