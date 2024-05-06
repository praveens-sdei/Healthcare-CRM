import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberPreviewCardComponent } from './subscriber-preview-card.component';

describe('SubscriberPreviewCardComponent', () => {
  let component: SubscriberPreviewCardComponent;
  let fixture: ComponentFixture<SubscriberPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberPreviewCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
