import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingdentalbasicinfoComponent } from './pendingdentalbasicinfo.component';

describe('PendingdentalbasicinfoComponent', () => {
  let component: PendingdentalbasicinfoComponent;
  let fixture: ComponentFixture<PendingdentalbasicinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingdentalbasicinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingdentalbasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
