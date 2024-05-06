import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticalOrderRequestComponent } from './optical-order-request.component';

describe('OpticalOrderRequestComponent', () => {
  let component: OpticalOrderRequestComponent;
  let fixture: ComponentFixture<OpticalOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpticalOrderRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticalOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
