import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminClaimDetailViewComponent } from './super-admin-claim-detail-view.component';

describe('SuperAdminClaimDetailViewComponent', () => {
  let component: SuperAdminClaimDetailViewComponent;
  let fixture: ComponentFixture<SuperAdminClaimDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminClaimDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminClaimDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
