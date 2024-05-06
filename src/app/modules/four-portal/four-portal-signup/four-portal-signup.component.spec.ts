import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalSignupComponent } from './four-portal-signup.component';

describe('FourPortalSignupComponent', () => {
  let component: FourPortalSignupComponent;
  let fixture: ComponentFixture<FourPortalSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
