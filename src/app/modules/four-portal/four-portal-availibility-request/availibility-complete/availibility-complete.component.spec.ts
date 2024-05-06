import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailibilityCompleteComponent } from './availibility-complete.component';

describe('AvailibilityCompleteComponent', () => {
  let component: AvailibilityCompleteComponent;
  let fixture: ComponentFixture<AvailibilityCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailibilityCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailibilityCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
