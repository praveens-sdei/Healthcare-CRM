import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalEPrescriptionComponent } from './four-portal-e-prescription.component';

describe('FourPortalEPrescriptionComponent', () => {
  let component: FourPortalEPrescriptionComponent;
  let fixture: ComponentFixture<FourPortalEPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalEPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalEPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
