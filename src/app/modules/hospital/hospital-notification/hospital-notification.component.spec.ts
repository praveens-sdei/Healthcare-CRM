import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalNotificationComponent } from './hospital-notification.component';

describe('HospitalNotificationComponent', () => {
  let component: HospitalNotificationComponent;
  let fixture: ComponentFixture<HospitalNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
