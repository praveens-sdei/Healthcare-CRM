import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorClaimsComponent } from './individual-doctor-claims.component';

describe('IndividualDoctorClaimsComponent', () => {
  let component: IndividualDoctorClaimsComponent;
  let fixture: ComponentFixture<IndividualDoctorClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
