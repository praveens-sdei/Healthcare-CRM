import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationclaimsdetailsComponent } from './hospitalizationclaimsdetails.component';

describe('HospitalizationclaimsdetailsComponent', () => {
  let component: HospitalizationclaimsdetailsComponent;
  let fixture: ComponentFixture<HospitalizationclaimsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationclaimsdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationclaimsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
