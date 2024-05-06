import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationLabImagingComponent } from './location-lab-imaging.component';

describe('LocationLabImagingComponent', () => {
  let component: LocationLabImagingComponent;
  let fixture: ComponentFixture<LocationLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
