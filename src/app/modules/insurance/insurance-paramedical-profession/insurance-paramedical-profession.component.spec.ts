import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceParamedicalProfessionComponent } from './insurance-paramedical-profession.component';

describe('InsuranceParamedicalProfessionComponent', () => {
  let component: InsuranceParamedicalProfessionComponent;
  let fixture: ComponentFixture<InsuranceParamedicalProfessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceParamedicalProfessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceParamedicalProfessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
