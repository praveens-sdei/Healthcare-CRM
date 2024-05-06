import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityDentalComponent } from './availability-dental.component';

describe('AvailabilityDentalComponent', () => {
  let component: AvailabilityDentalComponent;
  let fixture: ComponentFixture<AvailabilityDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
