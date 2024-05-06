import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalMedicineclaimsComponent } from './four-portal-medicineclaims.component';

describe('FourPortalMedicineclaimsComponent', () => {
  let component: FourPortalMedicineclaimsComponent;
  let fixture: ComponentFixture<FourPortalMedicineclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalMedicineclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalMedicineclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
