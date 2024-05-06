import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledorderrequestComponent } from './scheduledorderrequest.component';

describe('ScheduledorderrequestComponent', () => {
  let component: ScheduledorderrequestComponent;
  let fixture: ComponentFixture<ScheduledorderrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledorderrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledorderrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
