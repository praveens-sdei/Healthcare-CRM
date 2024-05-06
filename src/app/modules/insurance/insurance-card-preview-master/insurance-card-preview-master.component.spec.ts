import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCardPreviewMasterComponent } from './insurance-card-preview-master.component';

describe('InsuranceCardPreviewMasterComponent', () => {
  let component: InsuranceCardPreviewMasterComponent;
  let fixture: ComponentFixture<InsuranceCardPreviewMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCardPreviewMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCardPreviewMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
