import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeemanagementParamedicalComponent } from './feemanagement-paramedical.component';

describe('FeemanagementParamedicalComponent', () => {
  let component: FeemanagementParamedicalComponent;
  let fixture: ComponentFixture<FeemanagementParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeemanagementParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeemanagementParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
