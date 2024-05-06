import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailibilityDetailsComponent } from './availibility-details.component';

describe('AvailibilityDetailsComponent', () => {
  let component: AvailibilityDetailsComponent;
  let fixture: ComponentFixture<AvailibilityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailibilityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailibilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
