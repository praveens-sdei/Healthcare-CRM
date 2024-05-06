import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberPreviewCardAdminComponent } from './subscriber-preview-card-admin.component';

describe('SubscriberPreviewCardAdminComponent', () => {
  let component: SubscriberPreviewCardAdminComponent;
  let fixture: ComponentFixture<SubscriberPreviewCardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberPreviewCardAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberPreviewCardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
