import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceClaimProcessRoleComponent } from './insurance-claim-process-role.component';

describe('InsuranceClaimProcessRoleComponent', () => {
  let component: InsuranceClaimProcessRoleComponent;
  let fixture: ComponentFixture<InsuranceClaimProcessRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceClaimProcessRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceClaimProcessRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
