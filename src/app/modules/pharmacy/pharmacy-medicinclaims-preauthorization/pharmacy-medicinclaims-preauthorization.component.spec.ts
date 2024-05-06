import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyMedicinclaimsPreauthorizationComponent } from './pharmacy-medicinclaims-preauthorization.component';

describe('PharmacyMedicinclaimsPreauthorizationComponent', () => {
  let component: PharmacyMedicinclaimsPreauthorizationComponent;
  let fixture: ComponentFixture<PharmacyMedicinclaimsPreauthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyMedicinclaimsPreauthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyMedicinclaimsPreauthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
