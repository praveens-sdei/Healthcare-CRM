import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeFourPortalClaimDetailsComponent } from './make-four-portal-claim-details.component';

describe('MakeFourPortalClaimDetailsComponent', () => {
  let component: MakeFourPortalClaimDetailsComponent;
  let fixture: ComponentFixture<MakeFourPortalClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeFourPortalClaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeFourPortalClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
