import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberDetailViewComponent } from './subscriber-detail-view.component';

describe('SubscriberDetailViewComponent', () => {
  let component: SubscriberDetailViewComponent;
  let fixture: ComponentFixture<SubscriberDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
