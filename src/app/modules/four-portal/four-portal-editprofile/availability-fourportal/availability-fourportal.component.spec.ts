import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityFourportalComponent } from './availability-fourportal.component';

describe('AvailabilityFourportalComponent', () => {
  let component: AvailabilityFourportalComponent;
  let fixture: ComponentFixture<AvailabilityFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
