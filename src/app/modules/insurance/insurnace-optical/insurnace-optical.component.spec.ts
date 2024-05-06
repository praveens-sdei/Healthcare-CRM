import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceOpticalComponent } from './insurnace-optical.component';

describe('InsurnaceOpticalComponent', () => {
  let component: InsurnaceOpticalComponent;
  let fixture: ComponentFixture<InsurnaceOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
