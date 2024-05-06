import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalSubscriptionplanComponent } from './four-portal-subscriptionplan.component';

describe('FourPortalSubscriptionplanComponent', () => {
  let component: FourPortalSubscriptionplanComponent;
  let fixture: ComponentFixture<FourPortalSubscriptionplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalSubscriptionplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalSubscriptionplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
