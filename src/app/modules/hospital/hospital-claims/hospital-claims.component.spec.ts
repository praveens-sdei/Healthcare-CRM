import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalClaimsComponent } from './hospital-claims.component';

describe('HospitalClaimsComponent', () => {
  let component: HospitalClaimsComponent;
  let fixture: ComponentFixture<HospitalClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
