import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceParamedicalDetailsComponent } from './insurance-paramedical-details.component';

describe('InsuranceParamedicalDetailsComponent', () => {
  let component: InsuranceParamedicalDetailsComponent;
  let fixture: ComponentFixture<InsuranceParamedicalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceParamedicalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceParamedicalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
