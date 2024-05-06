import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePreauthorizationhospitalizationComponent } from './insurance-preauthorizationhospitalization.component';

describe('InsurancePreauthorizationhospitalizationComponent', () => {
  let component: InsurancePreauthorizationhospitalizationComponent;
  let fixture: ComponentFixture<InsurancePreauthorizationhospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePreauthorizationhospitalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePreauthorizationhospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
