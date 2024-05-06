import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceNotificationComponent } from './insurance-notification.component';

describe('InsuranceNotificationComponent', () => {
  let component: InsuranceNotificationComponent;
  let fixture: ComponentFixture<InsuranceNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
