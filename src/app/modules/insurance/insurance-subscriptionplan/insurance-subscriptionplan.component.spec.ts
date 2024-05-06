import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSubscriptionplanComponent } from './insurance-subscriptionplan.component';

describe('InsuranceSubscriptionplanComponent', () => {
  let component: InsuranceSubscriptionplanComponent;
  let fixture: ComponentFixture<InsuranceSubscriptionplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSubscriptionplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSubscriptionplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
