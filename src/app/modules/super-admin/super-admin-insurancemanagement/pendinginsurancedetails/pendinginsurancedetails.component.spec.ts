import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendinginsurancedetailsComponent } from './pendinginsurancedetails.component';

describe('PendinginsurancedetailsComponent', () => {
  let component: PendinginsurancedetailsComponent;
  let fixture: ComponentFixture<PendinginsurancedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendinginsurancedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendinginsurancedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
