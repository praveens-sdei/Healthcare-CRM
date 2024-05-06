import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityLabImagingComponent } from './availability-lab-imaging.component';

describe('AvailabilityLabImagingComponent', () => {
  let component: AvailabilityLabImagingComponent;
  let fixture: ComponentFixture<AvailabilityLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
