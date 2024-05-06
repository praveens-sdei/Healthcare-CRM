import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersdetailComponent } from './subscribersdetail.component';

describe('SubscribersdetailComponent', () => {
  let component: SubscribersdetailComponent;
  let fixture: ComponentFixture<SubscribersdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribersdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribersdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
