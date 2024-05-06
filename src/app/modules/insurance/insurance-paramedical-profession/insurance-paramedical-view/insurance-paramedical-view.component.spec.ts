import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceParamedicalViewComponent } from './insurance-paramedical-view.component';

describe('InsuranceParamedicalViewComponent', () => {
  let component: InsuranceParamedicalViewComponent;
  let fixture: ComponentFixture<InsuranceParamedicalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceParamedicalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceParamedicalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
