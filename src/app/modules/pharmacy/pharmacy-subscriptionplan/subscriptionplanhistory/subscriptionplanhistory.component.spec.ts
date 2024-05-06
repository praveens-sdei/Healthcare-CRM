import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionplanhistoryComponent } from './subscriptionplanhistory.component';

describe('SubscriptionplanhistoryComponent', () => {
  let component: SubscriptionplanhistoryComponent;
  let fixture: ComponentFixture<SubscriptionplanhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionplanhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionplanhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
