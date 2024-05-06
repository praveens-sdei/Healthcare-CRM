import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticallistComponent } from './opticallist.component';

describe('OpticallistComponent', () => {
  let component: OpticallistComponent;
  let fixture: ComponentFixture<OpticallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpticallistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
