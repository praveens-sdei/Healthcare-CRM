import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSignupComponent } from './insurance-signup.component';

describe('InsuranceSignupComponent', () => {
  let component: InsuranceSignupComponent;
  let fixture: ComponentFixture<InsuranceSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
