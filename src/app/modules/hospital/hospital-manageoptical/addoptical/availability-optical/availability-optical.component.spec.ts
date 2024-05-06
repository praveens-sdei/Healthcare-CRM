import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityOpticalComponent } from './availability-optical.component';

describe('AvailabilityOpticalComponent', () => {
  let component: AvailabilityOpticalComponent;
  let fixture: ComponentFixture<AvailabilityOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
