import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySubscriptionplanComponent } from './pharmacy-subscriptionplan.component';

describe('PharmacySubscriptionplanComponent', () => {
  let component: PharmacySubscriptionplanComponent;
  let fixture: ComponentFixture<PharmacySubscriptionplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacySubscriptionplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacySubscriptionplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
