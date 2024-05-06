import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingopticalbasicinfoComponent } from './pendingopticalbasicinfo.component';

describe('PendingopticalbasicinfoComponent', () => {
  let component: PendingopticalbasicinfoComponent;
  let fixture: ComponentFixture<PendingopticalbasicinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingopticalbasicinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingopticalbasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
