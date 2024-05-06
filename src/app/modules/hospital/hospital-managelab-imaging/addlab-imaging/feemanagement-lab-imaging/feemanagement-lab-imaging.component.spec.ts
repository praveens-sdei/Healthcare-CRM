import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeemanagementLabImagingComponent } from './feemanagement-lab-imaging.component';

describe('FeemanagementLabImagingComponent', () => {
  let component: FeemanagementLabImagingComponent;
  let fixture: ComponentFixture<FeemanagementLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeemanagementLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeemanagementLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
