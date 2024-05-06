import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyMedicinclaimsComponent } from './pharmacy-medicinclaims.component';

describe('PharmacyMedicinclaimsComponent', () => {
  let component: PharmacyMedicinclaimsComponent;
  let fixture: ComponentFixture<PharmacyMedicinclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyMedicinclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyMedicinclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
