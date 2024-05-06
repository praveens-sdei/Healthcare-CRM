import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeFourPortalClaimListComponent } from './make-four-portal-claim-list.component';

describe('MakeFourPortalClaimListComponent', () => {
  let component: MakeFourPortalClaimListComponent;
  let fixture: ComponentFixture<MakeFourPortalClaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeFourPortalClaimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeFourPortalClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
