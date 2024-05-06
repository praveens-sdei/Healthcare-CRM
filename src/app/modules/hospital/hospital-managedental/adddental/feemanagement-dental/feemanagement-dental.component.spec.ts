import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeemanagementDentalComponent } from './feemanagement-dental.component';

describe('FeemanagementDentalComponent', () => {
  let component: FeemanagementDentalComponent;
  let fixture: ComponentFixture<FeemanagementDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeemanagementDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeemanagementDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
