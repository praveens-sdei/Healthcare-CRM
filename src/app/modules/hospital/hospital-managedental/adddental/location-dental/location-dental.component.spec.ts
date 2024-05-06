import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDentalComponent } from './location-dental.component';

describe('LocationDentalComponent', () => {
  let component: LocationDentalComponent;
  let fixture: ComponentFixture<LocationDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
