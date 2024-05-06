import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLabImaginClaimsComponent } from './insurance-lab-imagin-claims.component';

describe('InsuranceLabImaginClaimsComponent', () => {
  let component: InsuranceLabImaginClaimsComponent;
  let fixture: ComponentFixture<InsuranceLabImaginClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLabImaginClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLabImaginClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
