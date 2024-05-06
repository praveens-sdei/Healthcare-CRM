import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceOpticalDetailsComponent } from './insurnace-optical-details.component';

describe('InsurnaceOpticalDetailsComponent', () => {
  let component: InsurnaceOpticalDetailsComponent;
  let fixture: ComponentFixture<InsurnaceOpticalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceOpticalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceOpticalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
