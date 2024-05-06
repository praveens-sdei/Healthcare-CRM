import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceMedicalClaimAdminComponent } from './insurnace-medical-claim-admin.component';

describe('InsurnaceMedicalClaimAdminComponent', () => {
  let component: InsurnaceMedicalClaimAdminComponent;
  let fixture: ComponentFixture<InsurnaceMedicalClaimAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceMedicalClaimAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceMedicalClaimAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
