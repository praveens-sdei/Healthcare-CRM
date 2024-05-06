import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationclaimsComponent } from './hospitalizationclaims.component';

describe('HospitalizationclaimsComponent', () => {
  let component: HospitalizationclaimsComponent;
  let fixture: ComponentFixture<HospitalizationclaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationclaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
