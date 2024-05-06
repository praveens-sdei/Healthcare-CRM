import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompliantViewComponent } from './compliant-view.component';

describe('CompliantViewComponent', () => {
  let component: CompliantViewComponent;
  let fixture: ComponentFixture<CompliantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompliantViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompliantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
