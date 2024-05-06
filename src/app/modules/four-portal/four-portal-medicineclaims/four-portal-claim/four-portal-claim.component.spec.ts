import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalClaimComponent } from './four-portal-claim.component';

describe('FourPortalClaimComponent', () => {
  let component: FourPortalClaimComponent;
  let fixture: ComponentFixture<FourPortalClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
