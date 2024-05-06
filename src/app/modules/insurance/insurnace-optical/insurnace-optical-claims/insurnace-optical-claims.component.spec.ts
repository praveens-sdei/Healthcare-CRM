import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceOpticalClaimsComponent } from './insurnace-optical-claims.component';

describe('InsurnaceOpticalClaimsComponent', () => {
  let component: InsurnaceOpticalClaimsComponent;
  let fixture: ComponentFixture<InsurnaceOpticalClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceOpticalClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceOpticalClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
