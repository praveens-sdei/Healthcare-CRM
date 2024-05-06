import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicineClaimAdminComponent } from './insurance-medicine-claim-admin.component';

describe('InsuranceMedicineClaimAdminComponent', () => {
  let component: InsuranceMedicineClaimAdminComponent;
  let fixture: ComponentFixture<InsuranceMedicineClaimAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicineClaimAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicineClaimAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
