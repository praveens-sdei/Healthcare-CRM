import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFourportalComponent } from './location-fourportal.component';

describe('LocationFourportalComponent', () => {
  let component: LocationFourportalComponent;
  let fixture: ComponentFixture<LocationFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
