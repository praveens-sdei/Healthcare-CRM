import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyMedicalproductstestsComponent } from './pharmacy-medicalproductstests.component';

describe('PharmacyMedicalproductstestsComponent', () => {
  let component: PharmacyMedicalproductstestsComponent;
  let fixture: ComponentFixture<PharmacyMedicalproductstestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyMedicalproductstestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyMedicalproductstestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
