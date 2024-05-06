import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceParamedicalClaimsComponent } from './insurance-paramedical-claims.component';

describe('InsuranceParamedicalClaimsComponent', () => {
  let component: InsuranceParamedicalClaimsComponent;
  let fixture: ComponentFixture<InsuranceParamedicalClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceParamedicalClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceParamedicalClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
