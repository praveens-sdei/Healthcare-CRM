import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmenthistoryComponent } from './appointmenthistory.component';

describe('AppointmenthistoryComponent', () => {
  let component: AppointmenthistoryComponent;
  let fixture: ComponentFixture<AppointmenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
