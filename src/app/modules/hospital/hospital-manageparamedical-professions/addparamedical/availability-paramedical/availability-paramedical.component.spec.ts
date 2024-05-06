import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityParamedicalComponent } from './availability-paramedical.component';

describe('AvailabilityParamedicalComponent', () => {
  let component: AvailabilityParamedicalComponent;
  let fixture: ComponentFixture<AvailabilityParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
