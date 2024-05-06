import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSubscriptionplanComponent } from './hospital-subscriptionplan.component';

describe('HospitalSubscriptionplanComponent', () => {
  let component: HospitalSubscriptionplanComponent;
  let fixture: ComponentFixture<HospitalSubscriptionplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalSubscriptionplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalSubscriptionplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
