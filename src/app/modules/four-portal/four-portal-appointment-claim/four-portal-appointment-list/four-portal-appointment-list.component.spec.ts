import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalAppointmentListComponent } from './four-portal-appointment-list.component';

describe('FourPortalAppointmentListComponent', () => {
  let component: FourPortalAppointmentListComponent;
  let fixture: ComponentFixture<FourPortalAppointmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalAppointmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
