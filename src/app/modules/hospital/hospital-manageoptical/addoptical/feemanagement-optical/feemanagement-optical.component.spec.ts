import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeemanagementOpticalComponent } from './feemanagement-optical.component';

describe('FeemanagementOpticalComponent', () => {
  let component: FeemanagementOpticalComponent;
  let fixture: ComponentFixture<FeemanagementOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeemanagementOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeemanagementOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
