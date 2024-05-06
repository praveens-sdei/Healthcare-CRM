import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationOpticalComponent } from './location-optical.component';

describe('LocationOpticalComponent', () => {
  let component: LocationOpticalComponent;
  let fixture: ComponentFixture<LocationOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
