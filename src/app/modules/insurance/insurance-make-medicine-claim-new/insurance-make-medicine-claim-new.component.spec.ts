import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMakeMedicineClaimNewComponent } from './insurance-make-medicine-claim-new.component';

describe('InsuranceMakeMedicineClaimNewComponent', () => {
  let component: InsuranceMakeMedicineClaimNewComponent;
  let fixture: ComponentFixture<InsuranceMakeMedicineClaimNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMakeMedicineClaimNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMakeMedicineClaimNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
