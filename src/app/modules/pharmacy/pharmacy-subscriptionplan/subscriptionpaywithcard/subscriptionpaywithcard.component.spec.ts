import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionpaywithcardComponent } from './subscriptionpaywithcard.component';

describe('SubscriptionpaywithcardComponent', () => {
  let component: SubscriptionpaywithcardComponent;
  let fixture: ComponentFixture<SubscriptionpaywithcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionpaywithcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionpaywithcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
