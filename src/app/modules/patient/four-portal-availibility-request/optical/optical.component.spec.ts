import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticalComponent } from './optical.component';

describe('OpticalComponent', () => {
  let component: OpticalComponent;
  let fixture: ComponentFixture<OpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
