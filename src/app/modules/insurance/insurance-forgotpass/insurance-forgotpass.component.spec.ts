import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceForgotpassComponent } from './insurance-forgotpass.component';

describe('InsuranceForgotpassComponent', () => {
  let component: InsuranceForgotpassComponent;
  let fixture: ComponentFixture<InsuranceForgotpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceForgotpassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceForgotpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
