import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLoginComponent } from './insurance-login.component';

describe('InsuranceLoginComponent', () => {
  let component: InsuranceLoginComponent;
  let fixture: ComponentFixture<InsuranceLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
