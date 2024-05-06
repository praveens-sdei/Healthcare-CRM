import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicineclaimsComponent } from './insurance-medicineclaims.component';

describe('InsuranceMedicineclaimsComponent', () => {
  let component: InsuranceMedicineclaimsComponent;
  let fixture: ComponentFixture<InsuranceMedicineclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicineclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicineclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
