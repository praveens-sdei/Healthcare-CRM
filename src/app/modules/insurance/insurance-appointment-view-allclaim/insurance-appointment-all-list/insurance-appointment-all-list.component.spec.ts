import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceAppointmentAllListComponent } from './insurance-appointment-all-list.component';

describe('InsuranceAppointmentAllListComponent', () => {
  let component: InsuranceAppointmentAllListComponent;
  let fixture: ComponentFixture<InsuranceAppointmentAllListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceAppointmentAllListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceAppointmentAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
