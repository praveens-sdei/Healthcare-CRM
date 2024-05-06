import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationParamedicalComponent } from './location-paramedical.component';

describe('LocationParamedicalComponent', () => {
  let component: LocationParamedicalComponent;
  let fixture: ComponentFixture<LocationParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
