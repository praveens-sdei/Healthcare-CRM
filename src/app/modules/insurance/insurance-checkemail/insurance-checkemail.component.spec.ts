import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCheckemailComponent } from './insurance-checkemail.component';

describe('InsuranceCheckemailComponent', () => {
  let component: InsuranceCheckemailComponent;
  let fixture: ComponentFixture<InsuranceCheckemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCheckemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCheckemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
