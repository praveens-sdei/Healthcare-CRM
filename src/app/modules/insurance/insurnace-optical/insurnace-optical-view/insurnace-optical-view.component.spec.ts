import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceOpticalViewComponent } from './insurnace-optical-view.component';

describe('InsurnaceOpticalViewComponent', () => {
  let component: InsurnaceOpticalViewComponent;
  let fixture: ComponentFixture<InsurnaceOpticalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceOpticalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceOpticalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
