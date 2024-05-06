import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySignupComponent } from './pharmacy-signup.component';

describe('PharmacySignupComponent', () => {
  let component: PharmacySignupComponent;
  let fixture: ComponentFixture<PharmacySignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacySignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacySignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
