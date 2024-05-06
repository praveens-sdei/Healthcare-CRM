import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeemanagementFourportalComponent } from './feemanagement-fourportal.component';

describe('FeemanagementFourportalComponent', () => {
  let component: FeemanagementFourportalComponent;
  let fixture: ComponentFixture<FeemanagementFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeemanagementFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeemanagementFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
