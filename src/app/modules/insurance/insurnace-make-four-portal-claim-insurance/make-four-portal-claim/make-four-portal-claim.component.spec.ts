import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeFourPortalClaimComponent } from './make-four-portal-claim.component';

describe('MakeFourPortalClaimComponent', () => {
  let component: MakeFourPortalClaimComponent;
  let fixture: ComponentFixture<MakeFourPortalClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeFourPortalClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeFourPortalClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
