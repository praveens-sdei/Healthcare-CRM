import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceanalysisComponent } from './insuranceanalysis.component';

describe('InsuranceanalysisComponent', () => {
  let component: InsuranceanalysisComponent;
  let fixture: ComponentFixture<InsuranceanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceanalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
