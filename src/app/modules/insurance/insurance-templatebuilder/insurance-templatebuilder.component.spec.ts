import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceTemplatebuilderComponent } from './insurance-templatebuilder.component';

describe('InsuranceTemplatebuilderComponent', () => {
  let component: InsuranceTemplatebuilderComponent;
  let fixture: ComponentFixture<InsuranceTemplatebuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceTemplatebuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceTemplatebuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
