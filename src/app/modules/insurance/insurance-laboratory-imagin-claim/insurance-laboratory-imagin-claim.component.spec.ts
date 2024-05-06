import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLaboratoryImaginClaimComponent } from './insurance-laboratory-imagin-claim.component';

describe('InsuranceLaboratoryImaginClaimComponent', () => {
  let component: InsuranceLaboratoryImaginClaimComponent;
  let fixture: ComponentFixture<InsuranceLaboratoryImaginClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLaboratoryImaginClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLaboratoryImaginClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
